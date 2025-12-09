"use client";

import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import PostWidget from "@resources/components/features/Dashboard/widgets/PostWidget";
import ProjectWidget from "@resources/components/features/Dashboard/widgets/ProjectWidget";
import TodayTaskWidget from "@resources/components/features/Dashboard/widgets/TodayTaskWidget";
import { UserPermissions } from "lib/commons/constants/permissions";
import { Suspense } from "react";

export default function Page() {
  const userResources = new Set<string>();
  return (
    <PageContainer title="Home">
      <div className="flex flex-wrap gap-4">
        <Suspense fallback={<>Loading...</>}>
          <TodayTaskWidget />
        </Suspense>
        {userResources.has(UserPermissions.VIEW_PROJECT) && <ProjectWidget />}
        {userResources.has(UserPermissions.VIEW_POST) && <PostWidget />}
      </div>
    </PageContainer>
  );
}
