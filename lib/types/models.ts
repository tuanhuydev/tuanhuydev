export enum ProjectType {
  OUTSOURCE = "outsource",
  PRODUCT = "product",
  POC = "poc",
}

export enum ProjectStatus {
  PLAN = "plan",
  GOING = "going",
  CANCELLED = "cancelled",
  CLOSED = "closed",
}

export interface Project extends Timestamps {
  id: string;
  name: string;
  clientName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: ProjectType;
  status: ProjectStatus;
  users: Array<User["id"]>;
}

export interface User extends Timestamps {
  id: string;
}
