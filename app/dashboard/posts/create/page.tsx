import PageContainer from "@app/components/DashboardModule/PageContainer";
import Loader from "@app/components/commons/Loader";
import dynamic from "next/dynamic";

const PostFormV2 = dynamic(async () => (await import("@app/components/PostModule/PostFormV2")).PostFormV2, {
  ssr: false,
  loading: () => <Loader />,
});

export default async function Page() {
  return (
    <PageContainer title="Create New Post" goBack>
      <PostFormV2 />
    </PageContainer>
  );
}
