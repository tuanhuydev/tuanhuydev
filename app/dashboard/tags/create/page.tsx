import { TagFormV2 } from "@app/resources/components/features/Tag/TagFormV2";
import Loader from "@resources/components/common/Loader";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { Suspense } from "react";

export default async function Page() {
  return (
    <PageContainer title="Create New Tag" goBack>
      <Suspense fallback={<Loader />}>
        <TagFormV2 />
      </Suspense>
    </PageContainer>
  );
}
