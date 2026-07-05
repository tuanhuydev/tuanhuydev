import styles from "../../dashboard.module.css";
import { CategoryFormV2 } from "@app/resources/components/features/Category/CategoryFormV2";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { notFound } from "next/navigation";
import { getCategoryById } from "server/actions/categoryActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page(props: PageProps) {
  const { id } = await props.params;
  const category = await getCategoryById(id);

  if (!category) notFound();

  return (
    <PageContainer title="Edit Category" goBack="/dashboard/categories">
      <div className={styles.editWrap}>
        <CategoryFormV2 category={category} />
      </div>
    </PageContainer>
  );
}
