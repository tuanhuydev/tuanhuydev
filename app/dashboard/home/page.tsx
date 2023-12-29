"use client";

import WithAuth from "@lib/components/hocs/WithAuth";
import { useGetPostsQuery, useGetProjectsQuery } from "@lib/store/slices/apiSlice";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect } from "react";
import { ReactNode } from "react";

const Loader = dynamic(() => import("@lib/components/commons/Loader"), { ssr: false });

const GridViewOutlined = dynamic(async () => (await import("@mui/icons-material/GridViewOutlined")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const ArticleOutlined = dynamic(async () => (await import("@mui/icons-material/ArticleOutlined")).default, {
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

function Page({ setTitle, setPageKey }: any) {
  const { data: projects = [], isLoading: isProjectLoading } = useGetProjectsQuery({});
  const { data: posts = [], isLoading: isPostLoading } = useGetPostsQuery({});

  useEffect(() => {
    if (setTitle) setTitle("Home");
    if (setPageKey) setPageKey("home");
  }, [setTitle, setPageKey]);

  return (
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
        icon={<GridViewOutlined />}
      />
      <HomeCard
        url={"/dashboard/posts"}
        name={"Posts"}
        value={posts?.length}
        loading={isPostLoading}
        icon={<ArticleOutlined />}
      />
    </div>
  );
}

export default WithAuth(Page);
