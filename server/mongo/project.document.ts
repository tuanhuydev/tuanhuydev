import { ObjectId } from "mongodb";

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

export type ProjectDocument = {
  _id: ObjectId;
  name: string;
  clientName: string;
  description: string;
  users: Array<ObjectId>;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  type: ProjectType;
};
