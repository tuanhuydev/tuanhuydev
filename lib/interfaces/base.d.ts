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

type SelectOptionType = {
  label: string;
  value: any;
};

interface Timestamps {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface Project extends Timestamps {
  id: string;
  name: string;
  clientName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: ProjectType;
  status: ProjectStatus;
  users: Array<User["id"]>;
}

interface User extends Timestamps {
  id: string;
}
