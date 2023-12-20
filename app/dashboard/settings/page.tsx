"use client";

import dynamic from "next/dynamic";

const Loader = dynamic(() => import("@lib/components/commons/Loader"), { ssr: false });
const PageContainer = dynamic(() => import("@lib/DashboardModule/PageContainer").then((module) => module.default), {
  ssr: false,
  loading: () => <Loader />,
});

function Page() {
  return (
    <PageContainer title="setting" pageKey="Settings">
      hello
    </PageContainer>
  );
}

export default Page;
