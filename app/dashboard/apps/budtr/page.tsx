"use client";

import PageContainer from "@app/components/DashboardModule/PageContainer";

export default function Page() {
  return (
    <PageContainer title="Budtr" goBack="/dashboard/apps">
      <div className="p-3 bg-white h-full">Content</div>
    </PageContainer>
  );
}
