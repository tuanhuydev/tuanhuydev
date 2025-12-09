"use client";

import { Suspense, lazy } from "react";

// Replace dynamic imports with React lazy
const Loader = lazy(() => import("@resources/components/common/Loader"));
const PageContainer = lazy(() => import("@resources/components/features/Dashboard/PageContainer"));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContainer>Hello</PageContainer>
    </Suspense>
  );
}
