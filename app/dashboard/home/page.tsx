import PostWidget from "@app/components/DashboardModule/widgets/PostWidget";
import ProjectWidget from "@app/components/DashboardModule/widgets/ProjectWidget";
import TodayTaskWidget from "@app/components/DashboardModule/widgets/TodayTaskWidget";
import { UserPermissions } from "lib/commons/constants/permissions";
import { Suspense } from "react";

export default function Page() {
  const userResources = new Set<string>();
  return (
    <div className="flex flex-wrap gap-4">
      <Suspense fallback={<>Loading...</>}>
        <TodayTaskWidget />
      </Suspense>
      {userResources.has(UserPermissions.VIEW_PROJECT) && <ProjectWidget />}
      {userResources.has(UserPermissions.VIEW_POST) && <PostWidget />}
    </div>
  );
}
