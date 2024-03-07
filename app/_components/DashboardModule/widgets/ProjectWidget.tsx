import Card from "@app/_components/commons/Card";
import { getProjectsByUser } from "@app/server/actions/project";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import Link from "next/link";
import React from "react";

export default async function ProjectWidget() {
  const projects = await getProjectsByUser();
  return (
    <Link href={"/dashboard/projects"} prefetch className="self-baseline">
      <Card title="Projects" className="w-[12rem] min-h-[8rem]" value={projects?.length} icon={<GridViewOutlined />} />
    </Link>
  );
}
