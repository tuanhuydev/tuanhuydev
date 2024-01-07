"use client";

import dynamic from "next/dynamic";
import React from "react";

const Loader = dynamic(() => import("@components/commons/Loader"), {
  ssr: false,
});
const PageContainer = dynamic(
  () => import("@components/DashboardModule/PageContainer").then((module) => module.default),
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

export default function Page() {
  return <PageContainer>Hello</PageContainer>;
}
