"use client";

import BaseCard from "../commons/Card";
import { useCurrentUserPermission } from "@app/_queries/permissionQueries";
import { Button } from "@app/components/ui/button";
import { format } from "date-fns";
import { DATE_FORMAT } from "lib/commons/constants/base";
import { CheckSquare, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

export interface ProjectCard {
  project: ObjectType;
}

export interface ProjectCardExtraProps {
  id?: number;
}

const ProjectCard = memo(function ProjectCard({
  id,
  name,
  description,
  startDate,
  users,
}: Partial<ObjectType & { users: Array<ObjectType> }>) {
  const router = useRouter();
  const { data: permissions = [] } = useCurrentUserPermission();

  const allowUpdateProject = (permissions as Array<ObjectType>).some((permission: ObjectType = {}) => {
    const { action = "", type = "" } = permission;
    return action === "edit" && type === "project";
  });

  const allowViewTasks = (permissions as Array<ObjectType>).some((permission: ObjectType = {}) => {
    const { action = "", type = "" } = permission;
    return action === "view" && type === "task";
  });

  const navigateDetail = (event: any) => {
    event.stopPropagation();
    router.push(`/dashboard/projects/${id}`);
  };

  const navigateProjectTasks = (event: any) => {
    event.stopPropagation();
    if (id) router.push(`/dashboard/projects/${id}/tasks`);
  };

  const navigateProjectEdit = (event: any) => {
    event.stopPropagation();
    if (id) router.push(`/dashboard/projects/${id}/edit`);
  };
  const CardExtra = (
    <div className="flex items-center gap-1">
      {allowUpdateProject && (
        <Button size="icon" variant="ghost" onClick={navigateProjectEdit} title="Go to project's edit">
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {allowViewTasks && (
        <Button size="icon" variant="ghost" onClick={navigateProjectTasks} title="Go to project's tasks">
          <CheckSquare className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <BaseCard onClick={navigateDetail} title={name} titleExtra={CardExtra} className="w-full md:w-[18rem]">
      <p className="mt-0 mb-3 text-sm line-clamp-3 min-h-[4.5rem] text-gray-700 dark:text-gray-300">{description}</p>
      <div className="grid grid-cols-[minmax(max-content,_1fr)_minmax(max-content,_1fr)] gap-2 justify-between relative text-xs text-gray-900 dark:text-gray-100">
        <div>
          <span className="text-slate-400 dark:text-slate-500">People:&nbsp;</span>
          {users?.length ?? 0}
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500">Start Date:&nbsp;</span>
          {startDate ? format(new Date(startDate), DATE_FORMAT) : "-"}
        </div>
      </div>
    </BaseCard>
  );
});

ProjectCard.displayName = "ProjectCard";
export default ProjectCard;
