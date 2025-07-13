import PageContainer from "@app/components/DashboardModule/PageContainer";
import PostCard from "@app/components/PostModule/PostCard";
import PostsFilter from "@app/components/PostModule/PostsFilter";
import Empty from "@app/components/commons/Empty";
import Loader from "@app/components/commons/Loader";
import { UrlParams } from "@lib/interfaces/shared";
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
          <Suspense fallback={<Loader />} key={post.id}>
            <PostCard post={post} />
          </Suspense>
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
