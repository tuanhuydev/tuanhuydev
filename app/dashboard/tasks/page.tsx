"use client";

import PageContainer from "@components/DashboardModule/PageContainer";
import ControlPointOutlined from "@mui/icons-material/ControlPointOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import React, { useEffect } from "react";

function Page() {
  const createNewTask = () => {
    // navigate("/dashboard/posts/create");
  };

  return (
    <PageContainer title="Tasks">
      <div className="mb-3 flex items-center">
        <Input size="large" placeholder="Find your task" className="grow mr-2 rounded-sm" prefix={<SearchOutlined />} />
        <div className="flex gap-3">
          <Button
            size="large"
            type="primary"
            onClick={createNewTask}
            className="rounded-sm"
            icon={<ControlPointOutlined className="!h-[0.875rem] !w-[0.875rem] !leading-none" />}>
            New Task
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

export default Page;
