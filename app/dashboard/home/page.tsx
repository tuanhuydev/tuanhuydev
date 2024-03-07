import PageContainer from "@app/_components/DashboardModule/PageContainer";
import BasicDateCalendar from "@app/_components/DashboardModule/widgets/CalendarWidget";
import PostWidget from "@app/_components/DashboardModule/widgets/PostWidget";
import ProjectWidget from "@app/_components/DashboardModule/widgets/ProjectWidget";
import TodayTaskWidget from "@app/_components/DashboardModule/widgets/TodayTaskWidget";
import Card from "@app/_components/commons/Card";
import { getUserResources } from "@app/server/actions/user";
import { UserPermissions } from "@lib/shared/commons/constants/permissions";
import React from "react";

async function Page() {
  const userResources = await getUserResources();

  return (
    <PageContainer title="Home">
      <div className="flex flex-wrap gap-4">
        <Card className="w-[22rem]">
          <BasicDateCalendar />
        </Card>
        <TodayTaskWidget />
        {userResources.has(UserPermissions.VIEW_PROJECTS) && <ProjectWidget />}
        {userResources.has(UserPermissions.VIEW_POSTS) && <PostWidget />}
      </div>
    </PageContainer>
  );
}
export default Page;
