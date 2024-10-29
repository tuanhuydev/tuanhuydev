"use client";

import { DynamicFormConfig } from "../commons/Form/DynamicForm";
import BaseButton from "../commons/buttons/BaseButton";
import ConfirmBox from "../commons/modals/ConfirmBox";
import { useGlobal } from "../commons/providers/GlobalProvider";
import { useCreatePost, useDeletePost, useUpdatePost } from "@app/queries/postQueries";
import LogService from "@lib/services/LogService";
import { isURLValid, transformTextToDashed } from "@lib/shared/utils/helper";
import { Post } from "@lib/types";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

const DynamicForm = dynamic(() => import("../commons/Form/DynamicForm"), { ssr: false });

export interface PostFormV2Props {
  post?: Post;
}

export const PostFormV2: React.FC<PostFormV2Props> = ({ post }) => {
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
        <DynamicForm config={config} onSubmit={submit} mapValues={post} />
      </div>
      <div className="lg:col-span-2 col-span-12 flex flex-col gap-3 p-2">
        <BaseButton
          label={hasPost ? "Update Post" : "Save Draft"}
          variants="outline"
          onClick={handleSubmit(false)}
          loading={isPending}
        />
        {hasPost && !(post as unknown as Post)?.publishedAt && (
          <BaseButton label="Save & Publish" onClick={handleSubmit(true)} loading={isPending} />
        )}
        {hasPost && (
          <Button
            variant="contained"
            color="error"
            disabled={isDeleting}
            onClick={toggleConfirm(true)}
            disableElevation
            sx={{ mt: "0.2rem" }}>
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
