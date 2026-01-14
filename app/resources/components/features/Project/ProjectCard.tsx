"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../common/Card";
import { Project } from "@lib/types/project";
import { User } from "@lib/types/user";
import { Button } from "@resources/components/common/Button";
import { useCurrentUserPermission } from "@resources/queries/permissionQueries";
import { format } from "date-fns";
import { DATE_FORMAT } from "lib/commons/constants/base";
import { CheckSquare, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

export interface ProjectCard {
  project: Project & { users?: Array<string> };
}

const ProjectCard = memo(function ProjectCard({
  id,
  name,
  description,
  startDate,
  users,
}: Partial<Project & { users: Array<User> }>) {
  const router = useRouter();
  const { data: permissions = [] } = useCurrentUserPermission();

  const projectName = name as string;
  const projectDescription = description as string;

  const allowUpdateProject = (permissions as Array<Record<string, unknown>>).some(
    (permission: Record<string, unknown> = {}) => {
      const { action = "", type = "" } = permission;
      return action === "edit" && type === "project";
    },
  );

  const allowViewTasks = (permissions as Array<Record<string, unknown>>).some(
    (permission: Record<string, unknown> = {}) => {
      const { action = "", type = "" } = permission;
      return action === "view" && type === "task";
    },
  );

  const navigateDetail = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    router.push(`/dashboard/projects/${id}`);
  };

  const navigateProjectTasks = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (id) router.push(`/dashboard/projects/${id}/tasks`);
  };

  const navigateProjectEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (id) router.push(`/dashboard/projects/${id}/edit`);
  };

  return (
    <Card className="w-full md:w-[18rem] cursor-pointer" onClick={navigateDetail}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{projectName}</CardTitle>
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
      </CardHeader>
      <CardContent>
        <p className="mt-0 mb-3 text-sm line-clamp-3 min-h-[4.5rem] text-gray-700 dark:text-gray-300">
          {projectDescription}
        </p>
        <div className="grid grid-cols-[minmax(max-content,_1fr)_minmax(max-content,_1fr)] gap-2 justify-between relative text-xs text-gray-900 dark:text-gray-100">
          <div>
            <span className="text-slate-400 dark:text-slate-500">People:&nbsp;</span>
            {users?.length ?? 0}
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500">Start Date:&nbsp;</span>
            {startDate ? format(new Date(startDate as string | number | Date), DATE_FORMAT) : "-"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProjectCard.displayName = "ProjectCard";
export default ProjectCard;
