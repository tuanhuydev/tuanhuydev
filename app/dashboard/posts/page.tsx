"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import Loader from "@app/_components/commons/Loader";
import PageFilter from "@app/_components/commons/PageFilter";
import { usePostsQuery } from "@app/queries/postQueries";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useState } from "react";

const PostCard = dynamic(() => import("@components/PostModule/PostCard"), {
  ssr: false,
  loading: () => <Loader />,
});

const Empty = dynamic(() => import("antd/es/empty"), { ssr: false });

function Page() {
  const router = useRouter();
  const [filter, setFilter] = useState<ObjectType>({});

  const { data: posts = [], isLoading, refetch } = usePostsQuery(filter);

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

  return (
    <PageContainer title="Posts">
      <PageFilter
        onSearch={onSearchPost}
        onNew={navigateCreate}
        searchPlaceholder="Find your post"
        createLabel="New post"
      />
      <div className="grow overflow-auto pb-3">
        {isLoading ? (
          <Loader />
        ) : posts.length ? (
          <div className="flex flex-wrap gap-2">
            {posts.map((post: ObjectType) => (
              <PostCard post={post} key={post.id} />
            ))}
          </div>
        ) : (
          <Empty className="my-36" />
        )}
      </div>
    </PageContainer>
  );
}
export default Page;
