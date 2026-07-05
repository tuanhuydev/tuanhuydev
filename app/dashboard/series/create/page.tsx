import { SeriesFormV2 } from "@app/resources/components/features/Series/SeriesFormV2";
import Loader from "@resources/components/common/Loader";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { Suspense } from "react";

export default async function Page() {
  return (
    <PageContainer title="Create New Series" goBack>
      <Suspense fallback={<Loader />}>
        <SeriesFormV2 />
      </Suspense>
    </PageContainer>
  );
}
