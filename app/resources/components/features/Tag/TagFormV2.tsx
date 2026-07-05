"use client";

import ConfirmBox from "../../common/modals/ConfirmBox";
import styles from "../../formV2/EntityForm.module.css";
import { FormInput, InputType } from "../../formV2/FormInput";
import { Tag } from "@app/resources/types/tag.types";
import { transformTextToDashed } from "@lib/utils/helper";
import { Button } from "@resources/components/common/Button";
import { useGlobal } from "@resources/components/common/providers/GlobalProvider";
import { BASE_URL } from "lib/commons/constants/base";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface TagFormProps {
  tag?: Tag;
}

export type TagFormData = {
  name: string;
  slug: string;
};

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const TagFormV2: React.FC<TagFormProps> = ({ tag }) => {
  const router = useRouter();
  const { notify } = useGlobal();
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: { name: "", slug: "" },
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const hasTag = !!tag;
  const currentName = watch("name");

  useEffect(() => {
    setValue("slug", transformTextToDashed(currentName), { shouldDirty: true, shouldValidate: true });
  }, [currentName, setValue]);

  useEffect(() => {
    if (tag) {
      reset({ name: tag.name ?? "", slug: tag.slug ?? "" });
    }
  }, [tag, reset]);

  const submit = async (formData: TagFormData): Promise<void> => {
    try {
      if (hasTag && tag?.id) {
        const res = await fetch(`${BASE_URL}/api/tags/${tag.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to update tag");
        notify("Tag updated successfully", "success");
        router.refresh();
      } else {
        const res = await fetch(`${BASE_URL}/api/tags`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to save tag");
        notify("Tag saved successfully", "success");
        reset();
        router.push("/dashboard/tags");
        router.refresh();
      }
    } catch {
      notify(hasTag ? "Failed to update tag" : "Failed to save tag", "error");
    }
  };

  const handleDelete = useCallback(async () => {
    if (!tag?.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/tags/${tag.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete tag");
      notify("Tag deleted successfully", "success");
      router.push("/dashboard/tags");
      router.refresh();
    } catch {
      notify("Failed to delete tag", "error");
    } finally {
      setIsDeleting(false);
    }
  }, [tag?.id, notify, router]);

  return (
    <div className={styles.grid}>
      <div className={styles.main}>
        <div className={styles.field}>
          <FormInput label="name" name="name" placeholder="Tutorial" type={InputType.TEXT} control={control} />
        </div>
        <div className={styles.field}>
          <FormInput label="slug" name="slug" placeholder="tutorial" type={InputType.TEXT} control={control} />
        </div>
      </div>
      <div className={styles.actions}>
        <Button variant="outline" type="submit" onClick={handleSubmit(submit)}>
          {hasTag ? "Update Tag" : "Save Tag"}
        </Button>
        {hasTag && (
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={() => setOpenConfirm(true)}
            className={styles.deleteButton}>
            Delete Tag
          </Button>
        )}
      </div>
      <ConfirmBox
        title="Delete Tag"
        description="Are you sure you want to delete this tag?"
        open={openConfirm}
        onConfirm={handleDelete}
        onClose={() => setOpenConfirm(false)}
      />
    </div>
  );
};
