import { CategoryFormV2 } from "@app/resources/components/features/Category/CategoryFormV2";
import Loader from "@resources/components/common/Loader";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { Suspense } from "react";

export default async function Page() {
  return (
    <PageContainer title="Create New Category" goBack>
      <Suspense fallback={<Loader />}>
        <CategoryFormV2 />
      </Suspense>
    </PageContainer>
  );
}
