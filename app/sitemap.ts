import PostService from "@lib/backend/services/PostService";
import { BASE_URL } from "@lib/configs/constants";
import { Post } from "@prisma/client";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await PostService.getPosts()) || [];
  const sites = [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
  ];

  (posts as Array<Post>).forEach(({ publishedAt, deletedAt, updatedAt, slug }) => {
    if (publishedAt && !deletedAt) {
      sites.push({
        url: `${BASE_URL}/posts/${slug}`,
        lastModified: new Date(updatedAt),
      });
    }
  });

  return sites;
}
