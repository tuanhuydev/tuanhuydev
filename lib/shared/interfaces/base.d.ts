interface ObjectType {
  [key: string]: any;
}

type SelectOption = {
  label: string;
  value: any;
};

type FilterType = {
  page?: number;
  pageSize?: number;
  active?: boolean;
  search?: string;
  orderBy?: ObjectType[];
};
