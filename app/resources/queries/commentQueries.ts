import { useFetch } from "@features/Auth";
import { BASE_URL } from "@lib/commons/constants/base";
import { CreateCommentDto } from "@server/dto/Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTaskComment = (taskId: string) => {
  const { fetch } = useFetch();
  return useQuery<unknown, Error, Comment[]>({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      if (!taskId) return [];
      const response = await fetch(`${BASE_URL}/api/comments/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const { data } = (await response.json()) as { data: Comment[] };
      return data;
    },
    enabled: !!taskId,
  });
};

export const useMutateTaskComment = (taskId: string) => {
  const { fetch } = useFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Partial<CreateCommentDto>) => {
      const response = await fetch(`${BASE_URL}/api/comments/tasks/${taskId}`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to create comment");
      }
      return response.json() as Promise<{ data: Comment }>;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
};
