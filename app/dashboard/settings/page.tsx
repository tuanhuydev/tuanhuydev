"use client";

import Loader from "@components/commons/Loader";
import dynamic from "next/dynamic";

const PageContainer = dynamic(
  () => import("@components/DashboardModule/PageContainer").then((module) => module.default),
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

function Page() {
  return <PageContainer>hello</PageContainer>;
}

export default Page;
