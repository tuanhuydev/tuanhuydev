export enum SprintEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type Sprint = {
  id: string;
  name: string;
  description?: string;
  startDate?: Date;
  status: SprintEnum;
  endDate?: Date;
  projectId?: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
};
