"use client";

import PageContainer from "@resources/components/features/Dashboard/PageContainer";

export default function Page() {
  return (
    <PageContainer title="Budtr" goBack="/dashboard/apps">
      <div className="p-3 bg-white dark:bg-gray-800 h-full text-gray-900 dark:text-gray-100">Content</div>
    </PageContainer>
  );
}
