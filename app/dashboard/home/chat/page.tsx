"use client";

import { useFetch } from "@features/Auth/hooks/useFetch";
import type { ChatSession } from "@features/GenAI";
import { useDeleteChatSession, useNewChatSession } from "@features/GenAI/hooks/useChatSession";
import { BASE_URL } from "@lib/commons/constants/base";
import { ApiResponse } from "@lib/interfaces/shared";
import { Button } from "@resources/components/common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@resources/components/common/DropdownMenu";
import { Input } from "@resources/components/common/Input";
import MarkdownRenderer from "@resources/components/content/MarkdownRenderer";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bot, MoreVertical, Send, User } from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Page() {
  const { fetch } = useFetch();
  const queryClient = useQueryClient();
  const { mutateAsync: createSession } = useNewChatSession();
  const { mutateAsync: deleteSession } = useDeleteChatSession({
    onSuccess: (chatId) => {
      queryClient.setQueryData<ChatSession[] | undefined>(["ai", "chats"], (prev) => {
        if (!prev) return prev;
        return prev.filter((it) => String(it.id) !== String(chatId));
      });
      if (selectedId === chatId) setSelectedId("");
    },
    onMutate: (chatId) => {
      queryClient.setQueryData<ChatSession[] | undefined>(["ai", "chats"], (prev) => {
        if (!prev) return prev;
        return prev.filter((it) => String(it.id) !== String(chatId));
      });
      if (selectedId === chatId) setSelectedId("");
    },
  });

  const [selectedId, setSelectedId] = useState<string>("");
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmChatId, setConfirmChatId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleDelete = useCallback(
    async (chatId: string | null) => {
      try {
        await deleteSession(String(chatId));
        setConfirmChatId("");
      } catch (error) {
        console.error("Failed to delete chat session:", error);
      } finally {
        setShowConfirmDelete(false);
      }
    },
    [deleteSession],
  );

  // Load chat sessions
  const chatsQuery = useQuery<ChatSession[]>({
    queryKey: ["ai", "chats"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/ai/chats`);
      const json: ApiResponse<ChatSession[]> = (await res.json()) as ApiResponse<ChatSession[]>;
      if (!json.success) throw new Error(json.error || "Failed to load chat sessions");
      // Ensure id is string
      return (json.data || []).map((s: ChatSession) => ({
        ...s,
        id: String(s.id ?? ""),
      })) as ChatSession[];
    },
  });

  const createEmptyChat = useCallback(() => {
    queryClient.setQueryData<ChatSession[] | undefined>(["ai", "chats"], (prev) => {
      const list = prev ?? [];
      const hasPlaceholder = list.some((s: ChatSession) => String(s.id) === "");
      if (hasPlaceholder) return list;

      const placeholder: ChatSession = {
        id: "",
        name: "New Chat",
        model: "gemini-2.5-flash",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "",
      };
      return [placeholder, ...list];
    });
  }, [queryClient]);

  const sessions = useMemo(() => chatsQuery.data ?? [], [chatsQuery.data]);
  const selectedSession = useMemo(
    () => sessions.find((s) => String(s.id) === String(selectedId)) || null,
    [sessions, selectedId],
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedSession?.messages]);

  // On mount, create placeholder once
  useEffect(() => {
    createEmptyChat();
    setSelectedId("");
  }, []);

  // Auto-select most recent session when list loads (only once)
  useEffect(() => {
    if (!selectedId && sessions.length > 1) {
      const realSessions = sessions.filter((s) => String(s.id) !== "");
      if (realSessions.length > 0) {
        const sorted = [...realSessions].sort((a, b) => {
          const aT = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const bT = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return bT - aT;
        });
        setSelectedId(String(sorted[0].id));
      }
    }
  }, [sessions.length]);

  const sendPrompt = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setIsSending(true);
      setError(null);

      // Store previous state for rollback
      const previousData = queryClient.getQueryData<ChatSession[]>(["ai", "chats"]);
      let targetId = selectedId;

      try {
        // If no selected session, use placeholder
        if (!targetId) {
          const placeholder = sessions.find((s) => String(s.id) === "");
          if (!placeholder) {
            createEmptyChat();
          }
          targetId = "";
          setSelectedId("");
        }

        // Optimistic update: add user message
        queryClient.setQueryData<ChatSession[] | undefined>(["ai", "chats"], (prev) => {
          if (!prev) return prev;
          return prev.map((s) => {
            if (String(s.id) !== String(targetId)) return s;
            const nextMessages = [
              ...(s.messages || []),
              { role: "user" as const, content: text, timestamp: new Date() },
            ];
            return { ...s, messages: nextMessages, updatedAt: new Date() };
          });
        });

        setInput("");

        // First message flow: create backend session
        if (String(targetId) === "") {
          const created = await createSession(text);
          if (!created?.id) throw new Error("Failed to create session");

          queryClient.setQueryData<ChatSession[] | undefined>(["ai", "chats"], (prev) => {
            if (!prev) return prev;
            return prev.map((s) =>
              String(s.id) === "" ? { ...s, id: String(created.id), name: created.name ?? s.name } : s,
            );
          });
          setSelectedId(String(created.id));
          await queryClient.invalidateQueries({ queryKey: ["ai", "chats"] });
          return;
        }

        // Subsequent messages flow
        const res = await fetch(`${BASE_URL}/api/ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text, chatId: targetId }),
        });
        const json = (await res.json()) as unknown as ApiResponse<{ response: string }>;
        if (!json.success) throw new Error(json.error || "AI request failed");
        await queryClient.invalidateQueries({ queryKey: ["ai", "chats"] });
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : "Failed to send message");
        // Rollback optimistic update
        if (previousData) {
          queryClient.setQueryData(["ai", "chats"], previousData);
        }
        setInput(text); // Restore input
      } finally {
        setIsSending(false);
      }
    },
    [createSession, fetch, queryClient, selectedId, sessions, createEmptyChat],
  );

  const newChat = useCallback(() => {
    queryClient.setQueryData<ChatSession[] | undefined>(["ai", "chats"], (prev) => {
      const list = prev ?? [];
      const hasPlaceholder = list.some((s: ChatSession) => String(s.id) === "");
      if (hasPlaceholder) return list;

      const placeholder: ChatSession = {
        id: "",
        name: "New Chat",
        model: "gemini-2.5-flash",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "",
      };
      return [placeholder, ...list];
    });
    setSelectedId("");
    setInput("");
  }, [queryClient]);

  return (
    <PageContainer title="AI chat" goBack="/dashboard/apps">
      <div className="flex gap-4 h-full">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 rounded-lg flex flex-col gap-3">
          <div className="flex gap-2">
            <Button className="w-full" onClick={newChat}>
              + New chat
            </Button>
          </div>

          <div className="flex-1 overflow-auto ">
            {chatsQuery.isLoading && (
              <div className="text-sm opacity-70 text-gray-600 dark:text-gray-400">Loading…</div>
            )}
            {chatsQuery.isError && (
              <div className="text-sm text-red-500 dark:text-red-400">Failed to load sessions</div>
            )}
            <ul className="flex flex-col gap-1 m-0 p-0">
              {sessions.map((s) => {
                const isActive = String(s.id) === String(selectedId);
                const updated = s.updatedAt || s.createdAt;
                return (
                  <li
                    key={String(s.id)}
                    className={`group flex items-center gap-2 rounded px-2 py-2 cursor-pointer ${
                      isActive
                        ? "bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-900"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                    onClick={() => {
                      // If selecting an existing chat, clean up placeholder from cache
                      if (String(s.id) !== "") {
                        queryClient.setQueryData<ChatSession[] | undefined>(["ai", "chats"], (prev) => {
                          if (!prev) return prev;
                          return prev.filter(({ id }: ChatSession) => String(id) !== "");
                        });
                      }
                      setSelectedId(String(s.id));
                    }}>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-medium">{s.name || "New Chat"}</div>
                      <div className="truncate text-xs opacity-60">
                        {updated ? new Date(updated).toLocaleString() : ""}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="chat options">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmChatId(String(s.id));
                            setShowConfirmDelete(true);
                          }}>
                          Delete chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Confirm popover */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-xs" onClick={(e) => e.stopPropagation()}>
              <div className="text-sm mb-3 text-gray-900 dark:text-gray-100">Delete this chat?</div>
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowConfirmDelete(false);
                    setConfirmChatId("");
                  }}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    void handleDelete(confirmChatId);
                  }}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Chat content */}
        <section className="flex-1 border rounded-lg p-4 flex flex-col">
          {error && (
            <div className="mb-3 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex items-center justify-between">
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              <Button size="sm" variant="ghost" onClick={() => setError(null)} className="h-6 px-2">
                Dismiss
              </Button>
            </div>
          )}
          <div className="flex-1 overflow-auto space-y-3 pr-1">
            {(!selectedSession || ((selectedSession.messages?.length ?? 0) === 0 && !isSending)) && <Greeting />}

            {selectedSession && (selectedSession.messages?.length ?? 0) > 0 && (
              <div className="flex flex-col gap-3">
                {(selectedSession.messages || []).map((m, idx) => (
                  <ChatBubble key={idx} role={m.role} text={m.content} />
                ))}
              </div>
            )}

            {selectedSession && isSending && <ChatBubble role="assistant" text="Thinking…" isThinking />}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim() || isSending) return;
              void sendPrompt(input.trim());
            }}>
            <Input
              className="flex-1"
              placeholder="Send a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" variant="outline" disabled={isSending || !input.trim()}>
              <span className="mr-2">{isSending ? "Sending…" : "Send"}</span>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </section>
      </div>
    </PageContainer>
  );
}

function ChatBubble({ role, text, isThinking }: { role: "user" | "assistant"; text: string; isThinking?: boolean }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Avatar for assistant - shown on left */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-white border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
          <Bot className="h-5 w-5 text-gray-700 dark:text-gray-800" />
        </div>
      )}

      <div className="max-w-[75%] whitespace-normal break-words rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        {isThinking ? <span className="opacity-70">{text}</span> : <MarkdownRenderer content={text} />}
      </div>

      {/* Avatar for user - shown on right */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
}

function Greeting() {
  return (
    <div className="h-full grid place-items-center text-center opacity-70">
      <div>
        <div className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">How can I help you today?</div>
        <div className="text-sm text-gray-700 dark:text-gray-300">Ask me unknownthing to get started.</div>
      </div>
    </div>
  );
}
