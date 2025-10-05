import { useFetch } from "@features/Auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Types for hook options
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prompt?: string) => {
      const response = await authFetch("/api/ai/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat session");
      }

      return response.json();
    },
    onMutate: async (prompt?: string) => {
      if (onMutate) {
        await onMutate(prompt);
      }
    },
    onSuccess: (data: { id: string; name: string }, prompt?: string) => {
      queryClient.invalidateQueries({ queryKey: ["ai", "chats"] });

      if (onSuccess) {
        onSuccess(data, prompt);
      }
    },
    onError: (error: Error, prompt?: string) => {
      console.error("Error creating chat session:", error);
      if (onError) {
        onError(error, prompt);
      }
    },
  });
};

export const useDeleteChatSession = ({
  onMutate,
  onSuccess,
  onError,
  selectedId,
  setSelectedId,
}: DeleteChatSessionOptions = {}) => {
  const { fetch: authFetch } = useFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: string) => {
      await authFetch(`/api/ai/chats/${chatId}`, {
        method: "DELETE",
      });
      return chatId;
    },
    onMutate: async (chatId: string) => {
      if (onMutate) {
        await onMutate(chatId);
      }
    },
    onSuccess: (chatId: string) => {
      queryClient.invalidateQueries({ queryKey: ["ai", "chats"] });

      // If the deleted session was selected, reset to a default
      if (selectedId === chatId && setSelectedId) {
        setSelectedId("new");
      }

      if (onSuccess) {
        onSuccess(chatId);
      }
    },
    onError: (error: Error, chatId: string) => {
      console.error("Error deleting chat session:", error);
      if (onError) {
        onError(error, chatId);
      }
    },
  });
};
