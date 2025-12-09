"use client";

import ConfirmBox from "../../common/modals/ConfirmBox";
import { useGlobal } from "../../common/providers/GlobalProvider";
import { DynamicFormConfig } from "../../form/DynamicForm";
import { Button } from "@resources/components/common/Button";
import { useCreatePost, useDeletePost, useUpdatePost } from "@resources/queries/postQueries";
import { useQueryClient } from "@tanstack/react-query";
import { isURLValid, transformTextToDashed } from "lib/utils/helper";
import { useRouter } from "next/navigation";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import LogService from "server/services/LogService";

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

  const {
    mutateAsync: mutateCreatePost,
    isPending: isCreating,
    isSuccess: createSuccess,
    isError: createError,
  } = useCreatePost();

  const {
    mutateAsync: mutateUpdatePost,
    isPending: isUpdating,
    isSuccess: updateSuccess,
    isError: updateError,
  } = useUpdatePost();

  const { mutateAsync: mutateDeletePost, isSuccess: deleteSuccess, isPending: isDeleting } = useDeletePost();

  // States
  const [form, setForm] = useState<UseFormReturn | null>(null);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  // Constants
  const isSuccess = createSuccess || updateSuccess;
  const isError = createError || updateError;
  const isPending = isCreating || isUpdating || isDeleting;
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

  useEffect(() => {
    if (isSuccess) {
      notify("Post saved successfully", "success");
      if (post?.id) {
        queryClient.invalidateQueries({ queryKey: ["post", post?.id] });
      }
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/dashboard/posts");
    } else if (isError) {
      notify("Failed to save post", "error");
    }
  }, [hasPost, isError, isSuccess, notify, post?.id, queryClient, router]);

  useEffect(() => {
    if (form) {
      const subscription = form.watch((values, { name }) => {
        switch (name) {
          case "title":
            const slug = transformTextToDashed(values.title);
            form.setValue("slug", slug);
            break;
          case "thumbnail":
            if (isURLValid(values.thumbnail)) {
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
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/dashboard/posts");
    }
  }, [mutateDeletePost, notify, post, queryClient, router]);

  const handlePostMutation = useCallback(
    async (formData: ObjectType, mutationFn: (data: ObjectType) => Promise<any>, form?: UseFormReturn) => {
      try {
        if (form) {
          await form.trigger();
        }
        await mutationFn(formData);
        router.push("/dashboard/posts");
      } catch (error) {
        LogService.log(error);
      } finally {
        form?.reset();
      }
    },
    [router],
  );

  const createPost = useCallback(
    async (formData: ObjectType) => {
      await mutateCreatePost(formData);
    },
    [mutateCreatePost],
  );

  const updatePost = useCallback(
    async (formData: ObjectType) => {
      const postToUpdate = { id: post!.id, ...formData };
      await mutateUpdatePost(postToUpdate);
    },
    [mutateUpdatePost, post],
  );

  const submit = useCallback(
    async (formData: ObjectType) => {
      const mutationFn = hasPost ? updatePost : createPost;
      await handlePostMutation(formData, mutationFn);
    },
    [createPost, handlePostMutation, hasPost, updatePost],
  );

  const handleSubmit =
    (willPublished: boolean = false) =>
    async () => {
      if (willPublished) {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        form?.setValue("publishedAt", new Date().toISOString());
      }
      await form?.handleSubmit(submit as any)();
    };

  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <div className="lg:col-span-10 col-span-12">
        <Suspense fallback={<div>Loading...</div>}>
          <DynamicForm config={config} onSubmit={submit} mapValues={post} />
        </Suspense>
      </div>
      <div className="lg:col-span-2 col-span-12 flex flex-col gap-3 p-2">
        <Button variant="outline" onClick={handleSubmit(false)}>
          {hasPost ? "Update Post" : "Save Draft"}
        </Button>
        {hasPost && !(post as unknown as Post)?.publishedAt && (
          <Button onClick={handleSubmit(true)}>Save & Publish</Button>
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
        onConfirm={deletePost}
        onClose={toggleConfirm(false)}
      />
    </div>
  );
};
