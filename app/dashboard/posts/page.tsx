"use client";

import { useCurrentUserPermission } from "@app/_queries/permissionQueries";
import { usePostsQuery } from "@app/_queries/postQueries";
import PageContainer from "@app/components/DashboardModule/PageContainer";
import Empty from "@app/components/commons/Empty";
import Loader from "@app/components/commons/Loader";
import PageFilter from "@app/components/commons/PageFilter";
import { useRouter } from "next/navigation";
import { ChangeEvent, Suspense, lazy, useCallback, useMemo, useState } from "react";

// Replace dynamic import with React lazy
const PostCard = lazy(() => import("@app/components/PostModule/PostCard"));

export default function Page() {
  const router = useRouter();
  const { data: permissions = [] } = useCurrentUserPermission();
  const [filter, setFilter] = useState<ObjectType>({});
  const { data: posts = [], isFetching, refetch } = usePostsQuery(filter);

  const allowCreatePost = (permissions as Array<ObjectType>).some((permission: ObjectType = {}) => {
    const { action = "", type = "" } = permission;
    return action === "create" && type === "post";
  });

  const navigateCreate = useCallback(() => router.push("/dashboard/posts/create"), [router]);

  const onSearchPost = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTimeout(() => {
        const search = event.target.value;
        setFilter((prevFilter) => {
          if (search?.length) return { ...prevFilter, search };
          delete prevFilter?.search;
          return prevFilter;
        });
        refetch();
      }, 500);
    },
    [refetch],
  );

  const RenderPosts = useMemo(() => {
    if (isFetching) return <Loader />;
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
  }, [isFetching, posts]);

  return (
    <PageContainer title="Posts">
      <PageFilter
        onSearch={onSearchPost}
        onNew={navigateCreate}
        searchPlaceholder="Find your post"
        createLabel="New post"
        allowCreate={allowCreatePost}
      />
      <div className="grow overflow-auto pb-3">{RenderPosts}</div>
    </PageContainer>
  );
}
