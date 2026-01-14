export type Post = {
  id: string;
  title: string;
  content: string;
  slug: string;
  thumbnail?: string;
  publishedAt?: Date;
  updatedAt: Date;
  createdAt: Date;
};
