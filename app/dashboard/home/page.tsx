"use client";

import PageContainer from "@app/components/DashboardModule/PageContainer";
import PostWidget from "@app/components/DashboardModule/widgets/PostWidget";
import ProjectWidget from "@app/components/DashboardModule/widgets/ProjectWidget";
import TodayTaskWidget from "@app/components/DashboardModule/widgets/TodayTaskWidget";
import { UserPermissions } from "@lib/shared/commons/constants/permissions";
import { lazy, Suspense } from "react";

const WeatherWidget = lazy(() =>
  import("@app/components/DashboardModule/widgets/WeatherWidget").then((module) => ({ default: module.WeatherWidget })),
);

export default function Page() {
  // const { data: queryResources = [] } = useCurrentUserResources();
  // const userResources = new Set((queryResources as Array<any>).map(({ name }) => name));
  const userResources = new Set<string>();

  return (
    <PageContainer title="Home">
      <div className="flex flex-wrap gap-4">
        <TodayTaskWidget />
        <Suspense>
          <WeatherWidget />
        </Suspense>
        {userResources.has(UserPermissions.VIEW_PROJECT) && <ProjectWidget />}
        {userResources.has(UserPermissions.VIEW_POST) && <PostWidget />}
      </div>
    </PageContainer>
  );
}
