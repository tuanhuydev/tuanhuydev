"use client";

import PostWidget from "@app/_components/DashboardModule/widgets/PostWidget";
import ProjectWidget from "@app/_components/DashboardModule/widgets/ProjectWidget";
import TodayTaskWidget from "@app/_components/DashboardModule/widgets/TodayTaskWidget";
import Card from "@app/_components/commons/Card";
import WithAuth from "@app/_components/commons/hocs/WithPermission";
import { RootState } from "@lib/configs/types";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import { Calendar } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Page({ setTitle }: any) {
  const { resources } = useSelector((state: RootState) => state.auth.currentUser) || {};

  useEffect(() => {
    if (setTitle) setTitle("Home");
  }, [setTitle]);

  return (
    <div className="flex flex-wrap gap-4">
      <Card className="w-[20rem]">
        <Calendar
          fullscreen={false}
          headerRender={() => (
            <div className="flex justify-between font-base text-slate-400 dark:text-slate-100 text-xl mb-3">
              <span className="block ">Calendar</span>
            </div>
          )}
        />
      </Card>
      <TodayTaskWidget />
      {resources.has(Permissions.VIEW_PROJECTS) && <ProjectWidget />}
      {resources.has(Permissions.VIEW_POSTS) && <PostWidget />}
    </div>
  );
}

export default WithAuth(Page, "home");
