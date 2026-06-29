import { PostFormV2 } from "@app/resources/components/features/Post/PostFormV2";
import { Post } from "@app/resources/types/post.types";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { getPostById } from "server/actions/blogActions";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page(props: PageProps) {
  const { id } = await props.params;
  const post = await getPostById(id);

  if (!post) notFound();

  return (
    <PageContainer title="Edit Post" goBack="/dashboard/posts">
      <div className="grow h-full pt-2">
        <PostFormV2 post={post as Post} />
      </div>
    </PageContainer>
  );
}
