import PostsPage from "@resources/landing/PostsPage";
import { BASE_URL } from "lib/commons/constants/base";
import { Metadata } from "next";
import { getCategories } from "server/actions/categoryActions";
import { getAllSeries } from "server/actions/seriesActions";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ category?: string; series?: string }>;
}

const DEFAULT_DESCRIPTION = "Thoughts on software engineering, career growth, and building things that matter.";

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { category, series } = await searchParams;

  let title = "Posts | tuanhuydev";
  let description = DEFAULT_DESCRIPTION;
  let canonicalPath = "/posts";

  if (category) {
    const categories = await getCategories();
    const match = categories.find((item) => item.slug === category);
    if (match) {
      title = `${match.name} Posts | tuanhuydev`;
      description = match.description ?? `Posts filed under ${match.name}.`;
      canonicalPath = `/posts?category=${match.slug}`;
    }
  } else if (series) {
    const seriesList = await getAllSeries();
    const match = seriesList.find((item) => item.slug === series);
    if (match) {
      title = `${match.name} Series | tuanhuydev`;
      description = match.description ?? `A series of posts: ${match.name}.`;
      canonicalPath = `/posts?series=${match.slug}`;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${canonicalPath}`,
      siteName: "tuanhuydev",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `${BASE_URL}${canonicalPath}` },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return <PostsPage searchParams={resolvedSearchParams} />;
}
