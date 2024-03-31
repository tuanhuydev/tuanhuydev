import Card from "@app/_components/commons/Card";
import { useProjectsQuery } from "@app/queries/projectQueries";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import Link from "next/link";
import React from "react";

export default function ProjectWidget() {
  const { data: projects = [] } = useProjectsQuery({ userId: "me" });
  return (
    <Link href={"/dashboard/projects"} prefetch className="self-baseline">
      <Card title="Projects" className="w-[12rem] min-h-[8rem]" value={projects?.length} icon={<GridViewOutlined />} />
    </Link>
  );
}
