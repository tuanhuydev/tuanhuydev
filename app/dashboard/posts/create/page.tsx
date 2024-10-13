import PageContainer from "@app/components/DashboardModule/PageContainer";
import Loader from "@app/components/commons/Loader";
import dynamic from "next/dynamic";

const PostForm = dynamic(() => import("@app/components/PostModule/PostForm"), {
  ssr: false,
  loading: () => <Loader />,
});

export default async function Page() {
  return (
    <PageContainer title="Create New Post" goBack>
      <PostForm />
    </PageContainer>
  );
}
