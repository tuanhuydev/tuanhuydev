import { PermissionDocument, Rule } from "@server/mongo/permission.document";

type ISODateString = string;

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

export type Permission = {
  id?: string;
  rules: Rule[];
};

export type PermissionConstructorInput = {
  rules: Rule[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
};

export type PermissionJSON = {
  id?: string;
  rules: Rule[];

  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
};

export class PermissionModel {
  public readonly _id?: string;
  public rules: Rule[];
  public createdAt: ISODateString;
  public updatedAt: ISODateString;
  public deletedAt: ISODateString | null;

  constructor(input: PermissionConstructorInput, _id?: string) {
    this._id = _id;
    this.rules = input.rules;

    this.createdAt = input.createdAt ?? new Date().toISOString();
    this.updatedAt = input.updatedAt ?? new Date().toISOString();
    this.deletedAt = input.deletedAt;
  }

  static toModel(doc: PermissionDocument) {
    return new PermissionModel(
      {
        rules: doc.rules,
        createdAt: doc.createdAt,
        deletedAt: doc.deletedAt,
        updatedAt: doc.updatedAt,
      },
      doc._id.toHexString(),
    );
  }

  toJSON(): PermissionJSON {
    return {
      id: this._id,
      rules: this.rules,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  touch() {
    this.updatedAt = new Date().toISOString();
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
