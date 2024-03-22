"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import BaseInput from "@app/_components/commons/Inputs/BaseInput";
import Loader from "@app/_components/commons/Loader";
import BaseButton from "@app/_components/commons/buttons/BaseButton";
import { usePostsQuery } from "@app/queries/postQueries";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import { Post } from "@prisma/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";

const PostCard = dynamic(() => import("@components/PostModule/PostCard"), {
  ssr: false,
  loading: () => <Loader />,
});

const Empty = dynamic(() => import("antd/es/empty"), { ssr: false });

function Page() {
  const [filter, setFilter] = useState<ObjectType>({});
  const router = useRouter();

  const { data: posts = [], isLoading, refetch } = usePostsQuery(filter);

  const navigateCreate = useCallback(() => router.push("/dashboard/posts/create"), [router]);

  const navigateEdit = useCallback((id: number) => router.push(`/dashboard/posts/${id}`), [router]);

  const searchTask: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const search = e.currentTarget.value || "";
      setTimeout(() => {
        setFilter((prevFilter) => {
          if (search?.length) return { ...prevFilter, search };
          delete prevFilter?.search;
          return prevFilter;
        });
        refetch();
      }, 300);
    },
    [refetch],
  );

  const triggerDeletePost = useCallback(
    () => (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      // confirm({
      //   title: "Are you sure to delete ?",
      //   icon: <ErrorOutlineOutlined />,
      //   okText: "Delete",
      //   okType: "danger",
      //   cancelText: "Cancel",
      //   onOk() {
      //     deletePost(postId);
      //   },
      // });
    },
    [],
  );

  const openPostInNewTab = useCallback(
    (postSlug: string) => (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      const newTab = window.open(`/posts/${postSlug}`, "_blank");
      newTab!.focus();
    },
    [],
  );

  const makePostCardActions = useCallback(
    ({ id, slug, publishedAt }: Post) => {
      const actions = [<DeleteOutlineOutlined className="!w-4 !h-4" key="delete" onClick={triggerDeletePost()} />];
      if (publishedAt) {
        actions.push(<VisibilityOutlined className="!w-4 !h-4" key="view" onClick={openPostInNewTab(slug)} />);
      }
      return actions;
    },
    [openPostInNewTab, triggerDeletePost],
  );

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      refetch();
    }, 300);
    return () => clearTimeout(searchTimeout);
  }, [filter?.search, refetch]);

  return (
    <PageContainer title="Posts">
      <div className="mb-3 flex gap-2 items-center">
        <BaseInput
          placeholder="Find your post"
          onChange={searchTask}
          className="grow mr-2 rounded-sm"
          startAdornment={<SearchOutlined />}
        />
        <div className="flex gap-3">
          <BaseButton onClick={navigateCreate} label="New Post" />
        </div>
      </div>
      <div className="grow overflow-auto pb-3">
        {isLoading ? (
          <Loader />
        ) : posts.length ? (
          <div className="flex flex-wrap gap-2">
            {posts.map((post: Post) => (
              <PostCard
                post={post}
                key={post.id}
                onClick={navigateEdit}
                CardProps={{
                  actions: makePostCardActions(post),
                }}
              />
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
