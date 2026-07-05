import styles from "../../dashboard.module.css";
import { TagFormV2 } from "@app/resources/components/features/Tag/TagFormV2";
import { Tag } from "@app/resources/types/tag.types";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { notFound } from "next/navigation";
import { getTagById } from "server/actions/tagActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page(props: PageProps) {
  const { id } = await props.params;
  const tag = await getTagById(id);

  if (!tag) notFound();

  return (
    <PageContainer title="Edit Tag" goBack="/dashboard/tags">
      <div className={styles.editWrap}>
        <TagFormV2 tag={tag as Tag} />
      </div>
    </PageContainer>
  );
}
