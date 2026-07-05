"use client";

import ConfirmBox from "../../common/modals/ConfirmBox";
import styles from "../../formV2/EntityForm.module.css";
import { FormInput, InputType } from "../../formV2/FormInput";
import { FormTextarea } from "../../formV2/FormTextarea";
import { Series } from "@app/resources/types/series.types";
import { getAuthHeaders } from "@lib/utils/apiClient";
import { transformTextToDashed } from "@lib/utils/helper";
import { Button } from "@resources/components/common/Button";
import { useGlobal } from "@resources/components/common/providers/GlobalProvider";
import { BASE_URL } from "lib/commons/constants/base";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface SeriesFormProps {
  series?: Series;
}

export type SeriesFormData = {
  name: string;
  slug: string;
  description: string;
};

export const SeriesFormV2: React.FC<SeriesFormProps> = ({ series }) => {
  const router = useRouter();
  const { notify } = useGlobal();
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: { name: "", slug: "", description: "" },
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const hasSeries = !!series;
  const currentName = watch("name");

  useEffect(() => {
    setValue("slug", transformTextToDashed(currentName), { shouldDirty: true, shouldValidate: true });
  }, [currentName, setValue]);

  useEffect(() => {
    if (series) {
      reset({ name: series.name ?? "", slug: series.slug ?? "", description: series.description ?? "" });
    }
  }, [series, reset]);

  const submit = async (formData: SeriesFormData): Promise<void> => {
    try {
      if (hasSeries && series?.id) {
        const res = await fetch(`${BASE_URL}/api/series/${series.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to update series");
        notify("Series updated successfully", "success");
        router.refresh();
      } else {
        const res = await fetch(`${BASE_URL}/api/series`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to save series");
        notify("Series saved successfully", "success");
        reset();
        router.push("/dashboard/series");
        router.refresh();
      }
    } catch {
      notify(hasSeries ? "Failed to update series" : "Failed to save series", "error");
    }
  };

  const handleDelete = useCallback(async () => {
    if (!series?.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/series/${series.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete series");
      notify("Series deleted successfully", "success");
      router.push("/dashboard/series");
      router.refresh();
    } catch {
      notify("Failed to delete series", "error");
    } finally {
      setIsDeleting(false);
    }
  }, [series?.id, notify, router]);

  return (
    <div className={styles.grid}>
      <div className={styles.main}>
        <div className={styles.field}>
          <FormInput label="name" name="name" placeholder="Learning Next.js" type={InputType.TEXT} control={control} />
        </div>
        <div className={styles.field}>
          <FormInput label="slug" name="slug" placeholder="learning-next-js" type={InputType.TEXT} control={control} />
        </div>
        <div className={styles.field}>
          <FormTextarea
            label="description"
            name="description"
            placeholder="What this series covers"
            control={control}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <Button variant="outline" type="submit" onClick={handleSubmit(submit)}>
          {hasSeries ? "Update Series" : "Save Series"}
        </Button>
        {hasSeries && (
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={() => setOpenConfirm(true)}
            className={styles.deleteButton}>
            Delete Series
          </Button>
        )}
      </div>
      <ConfirmBox
        title="Delete Series"
        description="Are you sure you want to delete this series?"
        open={openConfirm}
        onConfirm={handleDelete}
        onClose={() => setOpenConfirm(false)}
      />
    </div>
  );
};
