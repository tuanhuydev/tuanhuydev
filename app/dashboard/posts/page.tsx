import { UrlParams } from "@lib/interfaces/shared";
import Empty from "@resources/components/common/Empty";
import { ErrorBoundary } from "@resources/components/common/ErrorBoundary";
import Loader from "@resources/components/common/Loader";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import PostCard from "@resources/components/features/Post/PostCard";
import PostsFilter from "@resources/components/features/Post/PostsFilter";
import { getPosts } from "@server/actions/blogActions";
import { Suspense } from "react";

export default async function Page({ searchParams }: { searchParams: Promise<UrlParams> }) {
  const { search = "" } = await searchParams;
  const posts = await getPosts({ search });

  const RenderPosts = () => {
    if (!posts.length) return <Empty />;

    return (
      <div className="flex flex-wrap gap-2">
        {posts.map((post: Post) => (
          <ErrorBoundary key={post.id}>
            <Suspense fallback={<Loader />}>
              <PostCard post={post} />
            </Suspense>
          </ErrorBoundary>
        ))}
      </div>
    );
  };

  return (
    <PageContainer title="Posts">
      <PostsFilter searchPlaceholder="Find your post" createLabel="New post" />
      <div className="grow overflow-auto pb-3">{RenderPosts()}</div>
    </PageContainer>
  );
}
