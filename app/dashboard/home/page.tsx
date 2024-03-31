"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import PostWidget from "@app/_components/DashboardModule/widgets/PostWidget";
import ProjectWidget from "@app/_components/DashboardModule/widgets/ProjectWidget";
import TodayTaskWidget from "@app/_components/DashboardModule/widgets/TodayTaskWidget";
import { useCurrentUserResources } from "@app/queries/resourceQueries";
import { UserPermissions } from "@lib/shared/commons/constants/permissions";
import React from "react";

export default function Page() {
  const { data: queryResources = [] } = useCurrentUserResources();
  const userResources = new Set((queryResources as Array<any>).map(({ name }) => name));
  return (
    <PageContainer title="Home">
      <div className="flex flex-wrap gap-4">
        <TodayTaskWidget />
        {userResources.has(UserPermissions.VIEW_PROJECTS) && <ProjectWidget />}
        {userResources.has(UserPermissions.VIEW_POSTS) && <PostWidget />}
      </div>
    </PageContainer>
  );
}
