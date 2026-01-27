import { ObjectId } from "mongodb";

export enum RuleType {
  POST = "post",
  PROJECT = "project",
  SPRINT = "sprint",
  USER = "user",
  SETTING = "setting",
}

export enum RuleAction {
  VIEW = "view",
  EDIT = "edit",
  CREATE = "create",
  DELETE = "delete",
  ALL = "*",
}

export type Rule = {
  type: RuleType;
  action: RuleAction;
  resourceId: string;
};

export type PermissionDocument = {
  _id: ObjectId;
  rules: Rule[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
