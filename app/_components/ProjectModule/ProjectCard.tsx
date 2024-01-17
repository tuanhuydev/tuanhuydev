"use client";

import { DATE_FORMAT } from "@lib/configs/constants";
import { ObjectType } from "@lib/shared/interfaces/base";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Project } from "@prisma/client";
import format from "date-fns/format";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";

const Card = dynamic(async () => (await import("antd/es/card")).default, { ssr: false });
const Button = dynamic(async () => (await import("antd/es/button")).default, { ssr: false });
const Tooltip = dynamic(async () => (await import("antd/es/tooltip")).default, { ssr: false });

export interface ProjectCard {
  project: Project;
}

export interface ProjectCardExtraProps {
  id?: number;
}

const CardExtra = ({ id }: ProjectCardExtraProps) => {
  const router = useRouter();

  const navigateProjectTasks = (event: any) => {
    event.stopPropagation();
    if (id) router.push(`/dashboard/projects/${id}/tasks`);
  };

  return (
    <div className="flex items-center gap-3">
      <Tooltip title="Go to project'stasks" placement="top">
        <Button
          size="small"
          icon={<CheckBoxOutlineBlankIcon className="!w-4 !h-4 !text-base" />}
          type="text"
          className="!leading-none"
          onClick={navigateProjectTasks}
        />
      </Tooltip>
    </div>
  );
};

export default function ProjectCard({
  id,
  name,
  description,
  startDate,
  users,
}: Partial<Project & { users: Array<ObjectType> }>) {
  const router = useRouter();

  const navigateDetail = (event: any) => {
    event.stopPropagation();
    router.push(`/dashboard/projects/${id}`);
  };

  return (
    <Card
      title={name}
      hoverable
      loading={!name}
      rootClassName="w-[18rem]"
      headStyle={{ fontSize: 20 }}
      className="cursor-pointer"
      extra={<CardExtra id={id} />}
      onClick={navigateDetail}>
      <p className="mt-0 mb-3 line-clamp-3 min-h-[4.5rem]">{description}</p>
      <div className="grid grid-cols-[minmax(max-content,_1fr)_minmax(max-content,_1fr)] gap-2 justify-between relative text-xs">
        <div>
          <b>People:&nbsp;</b>
          {users?.length ?? 0}
        </div>
        <div>
          <b>Start Date:&nbsp;</b>
          {startDate ? format(new Date(startDate), DATE_FORMAT) : "-"}
        </div>
      </div>
    </Card>
  );
}
