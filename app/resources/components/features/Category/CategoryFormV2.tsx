"use client";

import ConfirmBox from "../../common/modals/ConfirmBox";
import styles from "../../formV2/EntityForm.module.css";
import { FormInput, InputType } from "../../formV2/FormInput";
import { FormTextarea } from "../../formV2/FormTextarea";
import { Category } from "@app/resources/types/category.types";
import { getAuthHeaders } from "@lib/utils/apiClient";
import { transformTextToDashed } from "@lib/utils/helper";
import { Button } from "@resources/components/common/Button";
import { useGlobal } from "@resources/components/common/providers/GlobalProvider";
import { BASE_URL } from "lib/commons/constants/base";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface CategoryFormProps {
  category?: Category;
}

export type CategoryFormData = {
  name: string;
  slug: string;
  description: string;
};

export const CategoryFormV2: React.FC<CategoryFormProps> = ({ category }) => {
  const router = useRouter();
  const { notify } = useGlobal();
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: { name: "", slug: "", description: "" },
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const hasCategory = !!category;
  const currentName = watch("name");

  useEffect(() => {
    setValue("slug", transformTextToDashed(currentName), { shouldDirty: true, shouldValidate: true });
  }, [currentName, setValue]);

  useEffect(() => {
    if (category) {
      reset({ name: category.name ?? "", slug: category.slug ?? "", description: category.description ?? "" });
    }
  }, [category, reset]);

  const submit = async (formData: CategoryFormData): Promise<void> => {
    try {
      if (hasCategory && category?.id) {
        const res = await fetch(`${BASE_URL}/api/categories/${category.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to update category");
        notify("Category updated successfully", "success");
        router.refresh();
      } else {
        const res = await fetch(`${BASE_URL}/api/categories`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to save category");
        notify("Category saved successfully", "success");
        reset();
        router.push("/dashboard/categories");
        router.refresh();
      }
    } catch {
      notify(hasCategory ? "Failed to update category" : "Failed to save category", "error");
    }
  };

  const handleDelete = useCallback(async () => {
    if (!category?.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/categories/${category.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete category");
      notify("Category deleted successfully", "success");
      router.push("/dashboard/categories");
      router.refresh();
    } catch {
      notify("Failed to delete category", "error");
    } finally {
      setIsDeleting(false);
    }
  }, [category?.id, notify, router]);

  return (
    <div className={styles.grid}>
      <div className={styles.main}>
        <div className={styles.field}>
          <FormInput label="name" name="name" placeholder="Engineering" type={InputType.TEXT} control={control} />
        </div>
        <div className={styles.field}>
          <FormInput label="slug" name="slug" placeholder="engineering" type={InputType.TEXT} control={control} />
        </div>
        <div className={styles.field}>
          <FormTextarea
            label="description"
            name="description"
            placeholder="What this category is about"
            control={control}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <Button variant="outline" type="submit" onClick={handleSubmit(submit)}>
          {hasCategory ? "Update Category" : "Save Category"}
        </Button>
        {hasCategory && (
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={() => setOpenConfirm(true)}
            className={styles.deleteButton}>
            Delete Category
          </Button>
        )}
      </div>
      <ConfirmBox
        title="Delete Category"
        description="Are you sure you want to delete this category?"
        open={openConfirm}
        onConfirm={handleDelete}
        onClose={() => setOpenConfirm(false)}
      />
    </div>
  );
};
