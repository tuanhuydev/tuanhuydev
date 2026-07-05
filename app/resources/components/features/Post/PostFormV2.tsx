"use client";

import ConfirmBox from "../../common/modals/ConfirmBox";
import { FormInput, InputType } from "../../formV2/FormInput";
import { FormMultiSelect } from "../../formV2/FormMultiSelect";
import { FormRichText } from "../../formV2/FormRichText";
import { FormSelect, SelectOption } from "../../formV2/FormSelect";
import styles from "./PostFormV2.module.css";
import { Post } from "@app/resources/types/post.types";
import { getAuthHeaders } from "@lib/utils/apiClient";
import { transformTextToDashed } from "@lib/utils/helper";
import { Button } from "@resources/components/common/Button";
import { MultiSelectOption } from "@resources/components/common/MultiSelect";
import { useGlobal } from "@resources/components/common/providers/GlobalProvider";
import { BASE_URL } from "lib/commons/constants/base";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const NO_CATEGORY = "none";
const NO_SERIES = "none";

export interface PostFormProps {
  post?: Post;
  categories?: SelectOption[];
  series?: SelectOption[];
  tags?: MultiSelectOption[];
}

export type PostFormData = {
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  publishedAt?: string;
  categoryId: string;
  seriesId: string;
  tagIds: string[];
};

function serializePostForm(formData: PostFormData) {
  return {
    ...formData,
    categoryId: formData.categoryId === NO_CATEGORY ? null : formData.categoryId,
    seriesId: formData.seriesId === NO_SERIES ? null : formData.seriesId,
  };
}

export const PostFormV2: React.FC<PostFormProps> = ({ post, categories = [], series = [], tags = [] }) => {
  const router = useRouter();
  const { notify } = useGlobal();
  const { control, handleSubmit, watch, setValue, reset } = useForm<PostFormData>({
    defaultValues: {
      title: "",
      slug: "",
      thumbnail: "",
      content: "",
      categoryId: NO_CATEGORY,
      seriesId: NO_SERIES,
      tagIds: [],
    },
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
      reset({
        title: post.title ?? "",
        slug: post.slug ?? "",
        thumbnail: post.thumbnail ?? "",
        content: post.content ?? "",
        categoryId: post.categoryId ?? NO_CATEGORY,
        seriesId: post.seriesId ?? NO_SERIES,
        tagIds: post.tagIds ?? [],
      });
    }
  }, [post, reset]);

  const submit = async (formData: PostFormData): Promise<void> => {
    const payload = serializePostForm(formData);
    try {
      if (hasPost && post?.id) {
        const res = await fetch(`${BASE_URL}/api/posts/${post.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ ...post, ...payload }),
        });
        if (!res.ok) throw new Error("Failed to update post");
        notify("Post updated successfully", "success");
        router.refresh();
      } else {
        const res = await fetch(`${BASE_URL}/api/posts`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
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

  const categoryOptions: SelectOption[] = [{ value: NO_CATEGORY, label: "No category" }, ...categories];
  const seriesOptions: SelectOption[] = [{ value: NO_SERIES, label: "No series" }, ...series];

  return (
    <div className={styles.grid}>
      <div className={styles.main}>
        <div className={styles.field}>
          <FormInput
            label="title"
            name="title"
            placeholder="How to build a solution"
            type={InputType.TEXT}
            control={control}
          />
        </div>
        <div className={styles.field}>
          <FormInput
            label="slug"
            name="slug"
            placeholder="how-to-build-a-solution"
            type={InputType.TEXT}
            control={control}
          />
        </div>
        <div className={styles.field}>
          <FormInput
            label="thumbnail"
            name="thumbnail"
            placeholder="https://..."
            type={InputType.TEXT}
            control={control}
          />
        </div>
        <div className={styles.twoCol}>
          <FormSelect label="category" name="categoryId" control={control} options={categoryOptions} />
          <FormSelect label="series" name="seriesId" control={control} options={seriesOptions} />
        </div>
        <div className={styles.field}>
          <FormMultiSelect label="tags" name="tagIds" control={control} options={tags} placeholder="Select tags..." />
        </div>
        <div className={styles.field}>
          <FormRichText control={control} name="content" label="Content" placeholder="Content detail" />
        </div>
      </div>
      <div className={styles.actions}>
        <Button variant="outline" type="submit" onClick={handleSubmit(submit)}>
          {hasPost ? "Update Post" : "Save Draft"}
        </Button>
        {hasPost && !post?.publishedAt && <Button onClick={handleSubmit(handlePublish)}>Save & Publish</Button>}
        {hasPost && (
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={() => setOpenConfirm(true)}
            className={styles.deleteButton}>
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
