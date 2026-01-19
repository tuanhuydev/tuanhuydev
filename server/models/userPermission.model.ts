import { UserPermissionDocument } from "@server/mongo/userPermission.document";

export type UserPermissionInputConstructor = {
  userId: string;
  permissionId: string;
};

export type UserPermissionJSON = {
  id?: string;
  permissionId: string;
  userId: string;
};

export class UserPermission {
  public readonly _id?: string;
  public readonly userId: string;
  public readonly permissionId: string;

  constructor(input: UserPermissionInputConstructor, _id?: string) {
    this._id = _id;
    this.permissionId = input.permissionId;
    this.userId = input.userId;
  }

  toModel(doc: UserPermissionDocument): UserPermission {
    return new UserPermission(
      { userId: doc.userId.toHexString(), permissionId: doc.permissionId.toHexString() },
      doc._id.toHexString(),
    );
  }

  toJSON(): UserPermissionJSON {
    return {
      id: this._id,
      permissionId: this.permissionId,
      userId: this.userId,
    };
  }
}
