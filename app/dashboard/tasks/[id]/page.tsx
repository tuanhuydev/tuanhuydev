"use client";

import { Suspense, lazy } from "react";

// Replace dynamic imports with React lazy
const Loader = lazy(() => import("@app/components/commons/Loader"));
const PageContainer = lazy(() => import("@app/components/DashboardModule/PageContainer"));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContainer>Hello</PageContainer>
    </Suspense>
  );
}
