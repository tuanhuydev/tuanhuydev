"use client";

import PageContainer from "@app/components/DashboardModule/PageContainer";

export default function Page() {
  const RenderPosts = () => {
    return <div className="flex flex-wrap gap-2"></div>;
  };

  return (
    <PageContainer title="AI chat">
      <div className="flex">
        <div style={{ width: 256 }}>Sidebar</div>
        <div>Chat list</div>
      </div>
    </PageContainer>
  );
}
