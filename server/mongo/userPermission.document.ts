import { ObjectId } from "mongodb";

export type UserPermissionDocument = {
  _id: ObjectId;
  userId: ObjectId;
  permissionId: ObjectId;
};
