import { ISODateString } from "./common.types";

export interface Series {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
}
