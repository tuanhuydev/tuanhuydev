"use client";

import dynamic from "next/dynamic";
import React from "react";

const Loader = dynamic(() => import("@lib/components/commons/Loader"), { ssr: false });

const PageContainer = dynamic(() => import("@lib/DashboardModule/PageContainer").then((module) => module.default), {
  ssr: false,
  loading: () => <Loader />,
});

const PostForm = dynamic(() => import("@lib/PostModule/PostForm"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function Page() {
  return (
    <PageContainer title="Create new post" pageKey="Posts" goBack>
      <PostForm />
    </PageContainer>
  );
}
