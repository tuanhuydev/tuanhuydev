type SelectOption<T> = {
  label: string;
  value: T;
};

interface FilterType {
  page?: number;
  pageSize?: number;
  active?: boolean;
  search?: string;
  orderBy?: Record<string, unknown>[];
}

type MetaDataParams = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

interface Timestamps {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
