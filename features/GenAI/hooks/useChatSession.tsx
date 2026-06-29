import { useFetch } from "@features/Auth";
import { useCallback, useState } from "react";

export interface NewChatSessionOptions {
  onMutate?: (prompt?: string) => void | Promise<void>;
  onSuccess?: (data: { id: string; name: string }, prompt?: string) => void;
  onError?: (error: Error, prompt?: string) => void;
}

export interface DeleteChatSessionOptions {
  onMutate?: (chatId: string) => void | Promise<void>;
  onSuccess?: (chatId: string) => void;
  onError?: (error: Error, chatId: string) => void;
  selectedId?: string;
  setSelectedId?: (id: string) => void;
}

export const useNewChatSession = ({ onMutate, onSuccess, onError }: NewChatSessionOptions = {}) => {
  const { fetch: authFetch } = useFetch();
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(
    async (prompt?: string) => {
      setIsPending(true);
      try {
        if (onMutate) await onMutate(prompt);
        const response = await authFetch("/api/ai/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        if (!response.ok) throw new Error("Failed to create chat session");
        const data = (await response.json()) as { id: string; name: string };
        onSuccess?.(data, prompt);
        return data;
      } catch (error) {
        console.error("Error creating chat session:", error);
        onError?.(error as Error, prompt);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [authFetch, onMutate, onSuccess, onError],
  );

  return { mutateAsync, isPending };
};

export const useDeleteChatSession = ({
  onMutate,
  onSuccess,
  onError,
  selectedId,
  setSelectedId,
}: DeleteChatSessionOptions = {}) => {
  const { fetch: authFetch } = useFetch();
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(
    async (chatId: string) => {
      setIsPending(true);
      try {
        if (onMutate) await onMutate(chatId);
        await authFetch(`/api/ai/chats/${chatId}`, { method: "DELETE" });
        if (selectedId === chatId && setSelectedId) setSelectedId("new");
        onSuccess?.(chatId);
        return chatId;
      } catch (error) {
        console.error("Error deleting chat session:", error);
        onError?.(error as Error, chatId);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [authFetch, onMutate, onSuccess, onError, selectedId, setSelectedId],
  );

  return { mutateAsync, isPending };
};
