import { ProjectStatus, ProjectType } from "@lib/interfaces/enums";

export type Project = Timestamps & {
  id: string;
  name: string;
  clientName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: ProjectType;
  status: ProjectStatus;
  users: Array<string>;
};
