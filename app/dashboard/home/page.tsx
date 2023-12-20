"use client";

import { useGetPostsQuery, useGetProjectsQuery } from "@lib/store/slices/apiSlice";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import { ReactNode } from "react";

const Loader = dynamic(() => import("@lib/components/commons/Loader"), { ssr: false });

const PageContainer = dynamic(async () => (await import("@lib/DashboardModule/PageContainer")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const AppstoreOutlined = dynamic(() => import("@ant-design/icons/AppstoreOutlined"), {
  ssr: false,
  loading: () => <Loader />,
});

const ContainerOutlined = dynamic(() => import("@ant-design/icons/ContainerOutlined"), {
  ssr: false,
  loading: () => <Loader />,
});

const Calendar = dynamic(async () => (await import("antd/es/calendar")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Card = dynamic(async () => (await import("antd/es/card")).default, { ssr: false, loading: () => <Loader /> });

export interface HomeCardProps {
  url: string;
  name: string;
  value: number;
  icon?: ReactNode;
  loading?: boolean;
}

const HomeCard = React.memo(({ url, name, value, loading = false, icon }: HomeCardProps) => {
  return (
    <Link href={url} prefetch>
      <Card className="w-[12rem] hover:border-primary transition-all duration-150 cursor-pointer" loading={loading}>
        <div className="flex justify-between font-thin text-lg text-slate-400 mb-2">
          <span className="block ">{name}</span>
          {icon}
        </div>
        <span className="block text-3xl">{value}</span>
      </Card>
    </Link>
  );
});
HomeCard.displayName = "HomeCard";

export default function Page() {
  const { data: projects = [], isLoading: isProjectLoading } = useGetProjectsQuery({});
  const { data: posts = [], isLoading: isPostLoading } = useGetPostsQuery({});

  return (
    <PageContainer title="Home" pageKey="Home">
      <div className="flex wrap gap-4">
        <Card style={{ width: 300, height: 350 }}>
          <Calendar
            fullscreen={false}
            headerRender={() => (
              <div className="flex justify-between font-thin text-lg text-slate-400 mb-3">
                <span className="block ">Calendar</span>
              </div>
            )}
          />
        </Card>
        <HomeCard
          url={"/dashboard/projects"}
          name={"Projects"}
          value={projects?.length}
          loading={isProjectLoading}
          icon={<AppstoreOutlined />}
        />
        <HomeCard
          url={"/dashboard/posts"}
          name={"Posts"}
          value={posts?.length}
          loading={isPostLoading}
          icon={<ContainerOutlined />}
        />
      </div>
    </PageContainer>
  );
}
