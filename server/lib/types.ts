export interface Post extends Timestamps {
  id: string;
  title: string;
  content: string;
  slug: string;
  thumbnail?: string;
  publishedAt?: Date;
}
