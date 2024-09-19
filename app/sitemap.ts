import { getPosts } from "./server/actions/blog";
import { BASE_URL } from "@lib/configs/constants";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts({ published: true });
  const sites = [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/ads.txt`,
      lastModified: new Date(),
    },
  ];

  (posts as ObjectType[]).forEach(({ updatedAt, slug }) => {
    sites.push({
      url: `${BASE_URL}/posts/${slug}`,
      lastModified: new Date(updatedAt),
    });
  });

  return sites;
}
