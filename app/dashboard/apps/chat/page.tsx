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
import { MoreVertical, Send } from "lucide-react";
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
  const [menuChatId, setMenuChatId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmChatId, setConfirmChatId] = useState<string>("");

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
      const json: ApiResponse<ChatSession[]> = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load chat sessions");
      // Ensure id is string
      return (json.data || []).map((s: any) => ({
        ...s,
        id: String((s as any).id ?? (s as any)._id ?? ""),
      })) as ChatSession[];
    },
  });

  const createEmptyChat = useCallback(() => {
    queryClient.setQueryData<ChatSession[] | undefined>(["ai", "chats"], (prev) => {
      const list = prev ?? [];
      const hasPlaceholder = list.some((s: any) => String(s.id) === "");
      if (hasPlaceholder) return list;
      const placeholder: any = {
        id: "",
        name: "New Chat",
        model: "gemini-2.5-flash",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return [placeholder, ...list];
    });
  }, [queryClient]);

  const sessions = useMemo(() => chatsQuery.data ?? [], [chatsQuery.data]);
  const selectedSession = useMemo(
    () => sessions.find((s) => String(s.id) === String(selectedId)) || null,
    [sessions, selectedId],
  );

  // On mount, always start with a placeholder "New Chat" and select it
  useEffect(() => {
    createEmptyChat();
    setSelectedId("");
  }, [createEmptyChat, queryClient]);

  // Auto-select most recent session when list loads
  useEffect(() => {
    if (!selectedId && sessions.length) {
      // pick the most recently updated/created
      const sorted = [...sessions].sort((a: any, b: any) => {
        const aT = new Date((a as any).updatedAt || (a as any).createdAt || 0).getTime();
        const bT = new Date((b as any).updatedAt || (b as any).createdAt || 0).getTime();
        return bT - aT;
      });
      setSelectedId(String(sorted[0].id));
    }
  }, [sessions, selectedId]);

  const sendPrompt = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setIsSending(true);
      try {
        const appendOptimisticUserMessage = (targetId: string) => {
          queryClient.setQueryData<ChatSession[] | undefined>(["ai", "chats"], (prev) => {
            if (!prev) return prev;
            return prev.map((s: any) => {
              if (String(s.id) !== String(targetId)) return s;
              const nextMessages = [...(s.messages || []), { role: "user", content: text, timestamp: new Date() }];
              return { ...s, messages: nextMessages, updatedAt: new Date().toISOString() };
            });
          });
        };

        // If no selected session yet, ensure placeholder exists and use it for optimistic message
        let targetId = selectedId;
        if (!targetId) {
          queryClient.setQueryData<ChatSession[] | undefined>(["ai", "chats"], (prev) => {
            const list = prev ?? [];
            const hasPlaceholder = list.some((s: any) => String(s.id) === "");
            if (hasPlaceholder) return list;
            const placeholder: any = {
              id: "",
              name: "New Chat",
              model: "gemini-2.5-flash",
              messages: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            return [placeholder, ...list];
          });
          targetId = "";
          setSelectedId("");
        }

        // Optimistic append and clear input immediately
        appendOptimisticUserMessage(targetId);
        setInput("");

        // First message flow: create backend session and override placeholder
        if (String(targetId) === "") {
          const created = await createSession(text);
          if (created?.id) {
            queryClient.setQueryData<ChatSession[] | undefined>(["ai", "chats"], (prev) => {
              if (!prev) return prev;
              return prev.map((s: any) =>
                String(s.id) === "" ? { ...s, id: String(created.id), name: created.name ?? s.name } : s,
              );
            });
            setSelectedId(String(created.id));
          }
          await queryClient.invalidateQueries({ queryKey: ["ai", "chats"] });
          return;
        }

        // Subsequent messages flow: append on backend then refresh
        const res = await fetch(`${BASE_URL}/api/ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text, chatId: targetId }),
        });
        const json: ApiResponse<{ response: string }> = await res.json();
        if (!json.success) throw new Error(json.error || "AI request failed");
        await queryClient.invalidateQueries({ queryKey: ["ai", "chats"] });
      } catch (e) {
        console.error(e);
      } finally {
        setIsSending(false);
      }
    },
    [createSession, fetch, queryClient, selectedId],
  );

  const newChat = useCallback(async () => {
    queryClient.setQueryData<ChatSession[] | undefined>(["ai", "chats"], (prev) => {
      const list = prev ?? [];
      const hasPlaceholder = list.some((s: any) => String(s.id) === "");
      if (hasPlaceholder) return list;
      const placeholder: any = {
        id: "",
        name: "New Chat",
        model: "gemini-2.5-flash",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return [placeholder, ...list];
    });
    setSelectedId("");
    setInput("");
  }, [queryClient]);

  return (
    <PageContainer title="AI chat">
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
                const updated = (s as any).updatedAt || (s as any).createdAt;
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
                          return prev.filter((it: any) => String(it.id) !== "");
                        });
                      }
                      setSelectedId(String(s.id));
                    }}>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-medium">{s.name || "New Chat"}</div>
                      <div className="truncate text-xs opacity-60">
                        {updated ? new Date(updated as any).toLocaleString() : ""}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuChatId(String(s.id));
                          }}
                          aria-label="chat options">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmChatId(menuChatId ?? "");
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
                <Button size="sm" variant="destructive" onClick={() => handleDelete(confirmChatId)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Chat content */}
        <section className="flex-1 border rounded-lg p-4 flex flex-col">
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
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] whitespace-normal break-words rounded-lg px-3 py-2 text-sm ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        }`}>
        {isThinking ? <span className="opacity-70">{text}</span> : <MarkdownRenderer content={text} />}
      </div>
    </div>
  );
}

function Greeting() {
  return (
    <div className="h-full grid place-items-center text-center opacity-70">
      <div>
        <div className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">How can I help you today?</div>
        <div className="text-sm text-gray-700 dark:text-gray-300">Ask me anything to get started.</div>
      </div>
    </div>
  );
}
