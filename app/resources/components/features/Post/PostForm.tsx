"use client";

import ConfirmBox from "../../common/modals/ConfirmBox";
import { useGlobal } from "../../common/providers/GlobalProvider";
import { DynamicFormConfig } from "../../form/DynamicForm";
import { Post } from "@app/resources/types/post.types";
import { Button } from "@resources/components/common/Button";
import { useCreatePost, useDeletePost, useUpdatePost } from "@resources/queries/postQueries";
import { logService } from "@server/services/LogService";
import { useQueryClient } from "@tanstack/react-query";
import { isURLValid, transformTextToDashed } from "lib/utils/helper";
import { useRouter } from "next/navigation";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

// Replace dynamic import with React lazy
const DynamicForm = lazy(() => import("../../form/DynamicForm"));

export interface PostFormProps {
  post?: Post;
}

export const PostForm: React.FC<PostFormProps> = ({ post }) => {
  // Hooks
  const queryClient = useQueryClient();
  const router = useRouter();
  const { notify } = useGlobal();

  const { mutateAsync: mutateCreatePost, isSuccess: createSuccess, isError: createError } = useCreatePost();

  const { mutateAsync: mutateUpdatePost, isSuccess: updateSuccess, isError: updateError } = useUpdatePost();

  const { mutateAsync: mutateDeletePost, isPending: isDeleting } = useDeletePost();

  // States
  const [form, setForm] = useState<UseFormReturn | null>(null);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  // Constants
  const isSuccess = createSuccess || updateSuccess;
  const isError = createError || updateError;
  const hasPost = !!post;

  const config: DynamicFormConfig = {
    fields: [
      {
        name: "title",
        type: "text",
        options: {
          placeholder: "Post Title",
        },
        validate: { required: true },
      },
      {
        name: "slug",
        type: "text",
        options: {
          placeholder: "Post Slug",
          disabled: true,
        },
        validate: { required: true },
      },
      {
        name: "thumbnail",
        type: "text",
        options: {
          placeholder: "Thumbnail URL",
        },
      },
      {
        name: "content",
        type: "richeditor",
        options: {
          className: "min-h-96",
          placeholder: "Post Content",
        },
        validate: { required: true },
      },
    ],
    submitProps: {
      allowDefault: false,
    },
    setForm,
  };

  // Handles post mutation side effects
  const handlePostMutationEffect = useCallback(async () => {
    if (isSuccess) {
      notify("Post saved successfully", "success");
      if (post?.id) {
        await queryClient.invalidateQueries({ queryKey: ["post", post?.id] });
      }
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/dashboard/posts");
    } else if (isError) {
      notify("Failed to save post", "error");
    }
  }, [isSuccess, isError, notify, post?.id, queryClient, router]);

  useEffect(() => {
    // Only call the effect if success or error state changes
    if (isSuccess || isError) {
      void handlePostMutationEffect();
    }
  }, [isSuccess, isError, handlePostMutationEffect]);

  useEffect(() => {
    if (form) {
      const subscription = form.watch((values, { name }) => {
        switch (name) {
          case "title":
            const slug = transformTextToDashed(values.title as string);
            form.setValue("slug", slug);
            break;
          case "thumbnail":
            if (isURLValid(values.thumbnail as string)) {
              form.clearErrors("thumbnail");
            } else {
              form.setError("thumbnail", {
                type: "manual",
                message: "Please enter a valid URL",
              });
            }
            break;
          default:
            break;
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [form]);

  const toggleConfirm = useCallback(
    (toggle: boolean = false) =>
      () => {
        setOpenConfirm(toggle);
      },
    [],
  );

  const deletePost = useCallback(async () => {
    if (post?.id) {
      await mutateDeletePost(post.id);
      notify("Post deleted successfully", "success");
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/dashboard/posts");
    }
  }, [mutateDeletePost, notify, post, queryClient, router]);

  const handlePostMutation = useCallback(
    async (
      formData: Record<string, unknown>,
      mutationFn: (data: Record<string, unknown>) => Promise<unknown>,
      form?: UseFormReturn,
    ) => {
      try {
        if (form) {
          await form.trigger();
        }
        await mutationFn(formData);
        router.push("/dashboard/posts");
      } catch (error) {
        logService.log(error);
      } finally {
        form?.reset();
      }
    },
    [router],
  );

  const createPost = useCallback(
    async (formData: Record<string, unknown>) => {
      await mutateCreatePost(formData as unknown as Post);
    },
    [mutateCreatePost],
  );

  const updatePost = useCallback(
    async (formData: Record<string, unknown>) => {
      const postToUpdate = { id: post!.id, ...formData };
      await mutateUpdatePost(postToUpdate as Post);
    },
    [mutateUpdatePost, post],
  );

  const submit = useCallback(
    async (formData: Record<string, unknown>) => {
      const mutationFn = hasPost ? updatePost : createPost;
      await handlePostMutation(formData, mutationFn);
    },
    [createPost, handlePostMutation, hasPost, updatePost],
  );

  const handleSubmit =
    (willPublished: boolean = false): (() => Promise<void>) =>
    async (): Promise<void> => {
      if (!form) return;
      if (willPublished) {
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        form.setValue("publishedAt", new Date().toISOString());
      }
      await form.handleSubmit(submit)();
    };

  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <div className="lg:col-span-10 col-span-12">
        <Suspense fallback={<div>Loading...</div>}>
          <DynamicForm config={config} onSubmit={submit} mapValues={post as unknown as Record<string, unknown>} />
        </Suspense>
      </div>
      <div className="lg:col-span-2 col-span-12 flex flex-col gap-3 p-2">
        <Button variant="outline" onClick={void handleSubmit(false)}>
          {hasPost ? "Update Post" : "Save Draft"}
        </Button>
        {hasPost && !(post as unknown as Post)?.publishedAt && (
          <Button onClick={void handleSubmit(true)}>Save & Publish</Button>
        )}
        {hasPost && (
          <Button variant="destructive" disabled={isDeleting} onClick={toggleConfirm(true)} className="mt-1">
            Delete Post
          </Button>
        )}
      </div>
      <ConfirmBox
        title="Delete Post"
        description="Are you sure you want to delete this post?"
        open={openConfirm}
        onConfirm={void deletePost}
        onClose={toggleConfirm(false)}
      />
    </div>
  );
};
