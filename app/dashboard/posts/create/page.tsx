import { PostFormV2 } from "@app/resources/components/features/Post/PostFormV2";
import Loader from "@resources/components/common/Loader";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { Suspense } from "react";
import { getCategories } from "server/actions/categoryActions";
import { getAllSeries } from "server/actions/seriesActions";
import { getTags } from "server/actions/tagActions";

export default async function Page() {
  const [categories, series, tags] = await Promise.all([getCategories(), getAllSeries(), getTags()]);

  return (
    <PageContainer title="Create New Post" goBack>
      <Suspense fallback={<Loader />}>
        <PostFormV2
          categories={categories.map((category) => ({ value: category.id ?? "", label: category.name }))}
          series={series.map((item) => ({ value: item.id ?? "", label: item.name }))}
          tags={tags.map((tag) => ({ value: tag.id ?? "", label: tag.name }))}
        />
      </Suspense>
    </PageContainer>
  );
}
