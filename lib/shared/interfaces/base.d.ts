interface ObjectType {
  [key: string]: any;
}

type SelectOption = {
  label: string;
  value: any;
};

interface FilterType {
  page?: number;
  pageSize?: number;
  active?: boolean;
  search?: string;
  orderBy?: ObjectType[];
}

type MetaDataParams = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
