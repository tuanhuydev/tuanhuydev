"use client";

import ConfirmBox from "../../common/modals/ConfirmBox";
import { FormInput, InputType } from "../../formV2/FormInput";
import { FormRichText } from "../../formV2/FormRichText";
import { Post } from "@app/resources/types/post.types";
import { transformTextToDashed } from "@lib/utils/helper";
import { Button } from "@resources/components/common/Button";
import { useGlobal } from "@resources/components/common/providers/GlobalProvider";
import { BASE_URL } from "lib/commons/constants/base";
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
  publishedAt?: string;
};

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const PostFormV2: React.FC<PostFormProps> = ({ post }) => {
  const router = useRouter();
  const { notify } = useGlobal();
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: { title: "", slug: "", thumbnail: "", content: "" },
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const hasPost = !!post;
  const currentTitle = watch("title");

  useEffect(() => {
    setValue("slug", transformTextToDashed(currentTitle), { shouldDirty: true, shouldValidate: true });
  }, [currentTitle, setValue]);

  useEffect(() => {
    if (post) {
      reset({ title: post.title ?? "", slug: post.slug ?? "", thumbnail: post.thumbnail ?? "", content: post.content ?? "" });
    }
  }, [post, reset]);

  const submit = async (formData: PostFormData): Promise<void> => {
    try {
      if (hasPost && post?.id) {
        const res = await fetch(`${BASE_URL}/api/posts/${post.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ ...post, ...formData }),
        });
        if (!res.ok) throw new Error("Failed to update post");
        notify("Post updated successfully", "success");
        router.refresh();
      } else {
        const res = await fetch(`${BASE_URL}/api/posts`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to save post");
        notify("Post saved successfully", "success");
        reset();
        router.push("/dashboard/posts");
        router.refresh();
      }
    } catch {
      notify(hasPost ? "Failed to update post" : "Failed to save post", "error");
    }
  };

  const handlePublish = async (formData: PostFormData): Promise<void> => {
    await submit({ ...formData, publishedAt: new Date().toISOString() });
  };

  const handleDelete = useCallback(async () => {
    if (!post?.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${post.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete post");
      notify("Post deleted successfully", "success");
      router.push("/dashboard/posts");
      router.refresh();
    } catch {
      notify("Failed to delete post", "error");
    } finally {
      setIsDeleting(false);
    }
  }, [post?.id, notify, router]);

  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <div className="lg:col-span-10 col-span-12">
        <div className="mb-3">
          <FormInput label="title" name="title" placeholder="How to build a solution" type={InputType.TEXT} control={control} />
        </div>
        <div className="mb-3">
          <FormInput label="slug" name="slug" placeholder="how-to-build-a-solution" type={InputType.TEXT} control={control} />
        </div>
        <div className="mb-3">
          <FormInput label="thumbnail" name="thumbnail" placeholder="https://..." type={InputType.TEXT} control={control} />
        </div>
        <div className="mb-3">
          <FormRichText control={control} name="content" label="Content" placeholder="Content detail" />
        </div>
      </div>
      <div className="lg:col-span-2 col-span-12 flex flex-col gap-3 p-2">
        <Button variant="outline" type="submit" onClick={handleSubmit(submit)}>
          {hasPost ? "Update Post" : "Save Draft"}
        </Button>
        {hasPost && !post?.publishedAt && (
          <Button onClick={handleSubmit(handlePublish)}>Save & Publish</Button>
        )}
        {hasPost && (
          <Button variant="destructive" disabled={isDeleting} onClick={() => setOpenConfirm(true)} className="mt-1">
            Delete Post
          </Button>
        )}
      </div>
      <ConfirmBox
        title="Delete Post"
        description="Are you sure you want to delete this post?"
        open={openConfirm}
        onConfirm={handleDelete}
        onClose={() => setOpenConfirm(false)}
      />
    </div>
  );
};
