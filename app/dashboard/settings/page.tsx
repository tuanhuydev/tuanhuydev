"use client";

import Loader from "@lib/components/commons/Loader";
import dynamic from "next/dynamic";

const PageContainer = dynamic(() => import("@lib/DashboardModule/PageContainer").then((module) => module.default), {
  ssr: false,
  loading: () => <Loader />,
});

function Page() {
  return <PageContainer>hello</PageContainer>;
}

export default Page;
