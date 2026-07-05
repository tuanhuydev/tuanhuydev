import { ISODateString } from "./common.types";

export interface Tag {
  id?: string;
  name: string;
  slug: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
}
