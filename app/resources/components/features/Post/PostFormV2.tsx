"use client";

import ConfirmBox from "../../common/modals/ConfirmBox";
import { FormInput, InputType } from "../../formV2/FormInput";
import { FormRichText } from "../../formV2/FormRichText";
import { Post } from "@app/resources/types/post.types";
import { transformTextToDashed } from "@lib/utils/helper";
import { Button } from "@resources/components/common/Button";
import { useCreatePost, useDeletePost, useUpdatePost } from "@resources/queries/postQueries";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface PostFormProps {
  post?: Post;
}

export type PostFormData = {
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  publishedAt?: string; // For the publish logic
};

export const PostFormV2: React.FC<PostFormProps> = ({ post }) => {
  // Hooks
  const router = useRouter();
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      thumbnail: "",
      content: "",
    },
  });

  const { mutateAsync: mutatePost } = useCreatePost();
  const { mutateAsync: mutateUpdatePost } = useUpdatePost();
  const { mutateAsync: mutateDeletePost, isPending: isDeleting } = useDeletePost();

  // States
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const hasPost: boolean = !!post;
  const currentTitle: string = watch("title");

  const toggleConfirm = useCallback(
    (toggle: boolean = false) =>
      () => {
        setOpenConfirm(toggle);
      },
    [],
  );

  const handleDelete = useCallback(async () => {
    console.log(post);
    if (post?.id) {
      await mutateDeletePost(post.id);
      router.push("/dashboard/posts");
    }
  }, [post]);

  const submit = async (formData: PostFormData): Promise<void> => {
    if (hasPost) {
      const postId = (post as Post).id;
      if (postId) {
        const updatedBody: Partial<Post> = { ...post, ...formData };
        await mutateUpdatePost(updatedBody);
      }
      return;
    }
    await mutatePost(formData);
    router.push("/dashboard/posts");
    reset();
  };

  const handleSave = async (formData: PostFormData): Promise<void> => {
    await submit(formData);
  };

  const handlePublishPost = async (formData: PostFormData): Promise<void> => {
    formData.publishedAt = new Date().toISOString();
    await submit(formData);
  };

  useEffect(() => {
    const slug = transformTextToDashed(currentTitle);
    setValue("slug", slug, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [currentTitle, setValue]);

  useEffect(() => {
    if (post) {
      reset({
        title: post.title || "",
        slug: post.slug || "",
        thumbnail: post.thumbnail || "",
        content: post.content || "",
      });
    }
  }, [post, reset]);

  useEffect(() => {
    if (!hasPost && currentTitle) {
      const slug = transformTextToDashed(currentTitle);
      setValue("slug", slug, { shouldValidate: true, shouldDirty: true });
    }
  }, [currentTitle, setValue, hasPost]);

  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <div className="lg:col-span-10 col-span-12">
        <div className="mb-3">
          <FormInput
            label="title"
            name="title"
            placeholder="How to build a solution"
            type={InputType.TEXT}
            control={control}
          />
        </div>
        <div className="mb-3">
          <FormInput
            label="slug"
            name="slug"
            placeholder="how-to-build-a-solution"
            type={InputType.TEXT}
            control={control}
          />
        </div>
        <div className="mb-3">
          <FormInput
            label="thumbnail"
            name="thumbnail"
            placeholder="https://how-to-build-a-solution.png"
            type={InputType.TEXT}
            control={control}
          />
        </div>
        <div className="mb-3">
          <FormRichText control={control} name="content" label="Content" placeholder="Content detail" />
        </div>
      </div>
      <div className="lg:col-span-2 col-span-12 flex flex-col gap-3 p-2">
        <Button variant="outline" type="submit" onClick={handleSubmit(handleSave)}>
          {hasPost ? "Update Post" : "Save Draft"}
        </Button>
        {hasPost && !(post as unknown as Post)?.publishedAt && (
          <Button onClick={handleSubmit(handlePublishPost)}>Save & Publish</Button>
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
        onConfirm={handleDelete}
        onClose={toggleConfirm(false)}
      />
    </div>
  );
};
