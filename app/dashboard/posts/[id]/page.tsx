import styles from "../../dashboard.module.css";
import { PostFormV2 } from "@app/resources/components/features/Post/PostFormV2";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { notFound } from "next/navigation";
import { getPostById } from "server/actions/blogActions";
import { getCategories } from "server/actions/categoryActions";
import { getAllSeries } from "server/actions/seriesActions";
import { getTags } from "server/actions/tagActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page(props: PageProps) {
  const { id } = await props.params;
  const [post, categories, series, tags] = await Promise.all([
    getPostById(id),
    getCategories(),
    getAllSeries(),
    getTags(),
  ]);

  if (!post) notFound();

  return (
    <PageContainer title="Edit Post" goBack="/dashboard/posts">
      <div className={styles.editWrap}>
        <PostFormV2
          post={post}
          categories={categories.map((category) => ({ value: category.id ?? "", label: category.name }))}
          series={series.map((item) => ({ value: item.id ?? "", label: item.name }))}
          tags={tags.map((tag) => ({ value: tag.id ?? "", label: tag.name }))}
        />
      </div>
    </PageContainer>
  );
}
