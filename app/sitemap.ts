import { getPosts } from "../server/actions/blogActions";
import { BASE_URL } from "lib/commons/constants/base";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch only published posts since projects are not publicly accessible
    const posts = await getPosts({ published: true }).catch(() => []);

    const currentDate = new Date();

    // Static pages with appropriate priority and change frequency
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: BASE_URL,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${BASE_URL}/posts`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/privacy`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.3,
      },
    ];

    // Dynamic blog post pages
    const postPages: MetadataRoute.Sitemap = (posts as Post[])
      .filter((post) => post.slug && post.publishedAt) // Ensure posts have slug and are published
      .map(({ updatedAt, slug, publishedAt }) => ({
        url: `${BASE_URL}/posts/${slug}`,
        lastModified: updatedAt ? new Date(updatedAt) : publishedAt ? new Date(publishedAt) : currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    return [...staticPages, ...postPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Fallback sitemap with just static pages
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }
}
