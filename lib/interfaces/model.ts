export type Sprint = {
  id: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  projectId?: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
};
