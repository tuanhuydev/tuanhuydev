"use client";

import WithAuth from "@app/_components/hocs/WithAuth";
import { BASE_URL } from "@lib/configs/constants";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import { ObjectType } from "@lib/shared/interfaces/base";
import { Post } from "@prisma/client";
import { useDeletePostMutation, useGetPostsQuery } from "@store/slices/apiSlice";
import { App, MenuProps } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ChangeEvent, Fragment, useCallback, useEffect, useMemo, useState } from "react";

const Loader = dynamic(() => import("@components/commons/Loader"), { ssr: false });

const ErrorOutlineOutlined = dynamic(async () => await import("@mui/icons-material/ErrorOutlineOutlined"), {
  ssr: false,
});

const DeleteOutlineOutlined = dynamic(async () => await import("@mui/icons-material/DeleteOutlineOutlined"), {
  ssr: false,
});

const VisibilityOutlined = dynamic(async () => await import("@mui/icons-material/VisibilityOutlined"), {
  ssr: false,
});
const FileDownloadOutlinedIcon = dynamic(async () => await import("@mui/icons-material/FileDownloadOutlined"), {
  ssr: false,
});
const SearchOutlined = dynamic(async () => (await import("@mui/icons-material/SearchOutlined")).default, {
  ssr: false,
});
const KeyboardArrowDownOutlined = dynamic(async () => await import("@mui/icons-material/KeyboardArrowDownOutlined"), {
  ssr: false,
});

const PostCard = dynamic(() => import("@components/PostModule/PostCard"), {
  ssr: false,
  loading: () => <Loader />,
});

const Empty = dynamic(() => import("antd/es/empty"), { ssr: false });
const Flex = dynamic(() => import("antd/es/flex"), { ssr: false });
const DropdownButton = dynamic(async () => (await import("antd/es/dropdown")).default.Button, { ssr: false });
const Input = dynamic(() => import("antd/es/input"), { ssr: false });

function Page({ setTitle, setPageKey }: any) {
  const { notification, modal } = App.useApp();

  const [filter, setFilter] = useState<ObjectType>({});
  const { confirm } = modal;
  const router = useRouter();

  const { data: posts = [], isLoading } = useGetPostsQuery(filter);
  const [deletePost, { isSuccess, isError }] = useDeletePostMutation();

  const navigatePostCreate = useCallback(() => router.push("/dashboard/posts/create"), [router]);

  const navigatePostEdit = useCallback((id: number) => router.push(`/dashboard/posts/${id}`), [router]);

  const triggerDeletePost = useCallback(
    (postId: number) => (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      confirm({
        title: "Are you sure to delete ?",
        icon: <ErrorOutlineOutlined />,
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk() {
          deletePost(postId);
        },
      });
    },
    [confirm, deletePost],
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
      const actions = [<DeleteOutlineOutlined className="!w-4 !h-4" key="delete" onClick={triggerDeletePost(id)} />];
      if (publishedAt) {
        actions.push(<VisibilityOutlined className="!w-4 !h-4" key="view" onClick={openPostInNewTab(slug)} />);
      }
      return actions;
    },
    [openPostInNewTab, triggerDeletePost],
  );

  const exportPostsToJson = useCallback(async () => {
    // Fetch posts
    let allPosts = [];
    const response = await fetch(`${BASE_URL}/api/posts`, { cache: "no-cache" });
    if (response.ok) {
      const { data = [] } = await response.json();
      allPosts = data;
    }
    // Create blob from posts
    const postBlob = new Blob([JSON.stringify(allPosts)], { type: "application/json" });
    const url = window.URL.createObjectURL(postBlob);

    // Make hidden download element
    const downloadElement = document.createElement("a");
    downloadElement.style.display = "none";
    downloadElement.href = url;
    downloadElement.download = "posts.json";
    document.body.appendChild(downloadElement);
    downloadElement.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(downloadElement);
  }, []);

  const onSearchPosts = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      const search = event.target.value;
      setFilter((filter) => ({ ...filter, search }));
    }, 500);
  }, []);

  const RenderPosts: JSX.Element = useMemo(
    () => (
      <div className="flex flex-wrap gap-2">
        {posts.map((post: any) => (
          <PostCard
            post={post}
            key={post.id}
            onClick={navigatePostEdit}
            CardProps={{
              actions: makePostCardActions(post),
            }}
          />
        ))}
      </div>
    ),
    [makePostCardActions, navigatePostEdit, posts],
  );

  const menuItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Export JSON",
      icon: <FileDownloadOutlinedIcon />,
      onClick: exportPostsToJson,
    },
  ];

  useEffect(() => {
    if (isSuccess) notification.success({ message: "Delete Post Successfully" });
    if (isError) notification.error({ message: "Delete Post Fail" });
  }, [notification, isError, isSuccess]);

  useEffect(() => {
    if (setTitle) setTitle("Posts");
    if (setPageKey) setPageKey(Permissions.VIEW_POSTS);
  }, [setTitle, setPageKey]);

  return (
    <Fragment>
      <Flex gap="middle" data-testid="dashboard-posts-page-testid" className="mb-3">
        <Input
          size="large"
          placeholder="Find your post"
          onChange={onSearchPosts}
          className="grow mr-2 rounded-sm"
          prefix={<SearchOutlined />}
        />
        <div>
          <DropdownButton
            size="large"
            type="primary"
            onClick={navigatePostCreate}
            className="rounded-sm"
            icon={<KeyboardArrowDownOutlined />}
            menu={{ items: menuItems }}>
            Write New
          </DropdownButton>
        </div>
      </Flex>
      <div className="grow overflow-auto pb-3">
        {isLoading ? <Loader /> : posts.length ? RenderPosts : <Empty className="my-36" />}
      </div>
    </Fragment>
  );
}
export default WithAuth(Page);
