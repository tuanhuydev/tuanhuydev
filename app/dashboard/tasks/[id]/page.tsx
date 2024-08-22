"use client";

import dynamic from "next/dynamic";

const Loader = dynamic(() => import("@app/components/commons/Loader"), {
  ssr: false,
});
const PageContainer = dynamic(
  () => import("@app/components/DashboardModule/PageContainer").then((module) => module.default),
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

export default function Page() {
  return <PageContainer>Hello</PageContainer>;
}
