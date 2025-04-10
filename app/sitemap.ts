import { getPosts } from "../server/actions/blogActions";
import { BASE_URL } from "@lib/shared/commons/constants/base";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts({ published: true });
  const sites = [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
  ];

  (posts as Post[]).forEach(({ updatedAt, slug }) => {
    sites.push({
      url: `${BASE_URL}/posts/${slug}`,
      lastModified: new Date(updatedAt),
    });
  });

  return sites;
}
