export interface ObjectType {
  [key: string]: any;
}

export type FilterType = {
  page?: number;
  pageSize?: number;
  active?: boolean;
  search?: string;
  orderBy?: ObjectType[];
};
