import PostsPage from "@resources/landing/PostsPage";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Posts | tuanhuydev",
  description: "Thoughts on software engineering, career growth, and building things that matter.",
  openGraph: {
    title: "Posts | tuanhuydev",
    description: "Thoughts on software engineering, career growth, and building things that matter.",
    url: "https://tuanhuy.dev/posts",
    siteName: "tuanhuydev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Posts | tuanhuydev",
    description: "Thoughts on software engineering, career growth, and building things that matter.",
  },
  alternates: { canonical: "https://tuanhuy.dev/posts" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PostsPage />;
}
