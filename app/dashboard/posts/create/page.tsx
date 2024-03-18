import PageContainer from "@app/_components/DashboardModule/PageContainer";
import Loader from "@app/_components/commons/Loader";
import dynamic from "next/dynamic";
import React from "react";

const PostForm = dynamic(() => import("@components/PostModule/PostForm"), {
  ssr: false,
  loading: () => <Loader />,
});

async function Page() {
  return (
    <PageContainer title="Create New Post" goBack>
      <PostForm />
    </PageContainer>
  );
}

export default Page;
