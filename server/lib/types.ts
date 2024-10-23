export type Post = {
  _id: string;
  title: string;
  content: string;
  slug: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
