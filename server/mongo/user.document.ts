import { ObjectId } from "mongodb";

export type UserDocument = {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
