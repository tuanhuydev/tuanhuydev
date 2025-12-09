import { PostItem } from "./PostItem";
import React from "react";

export interface PostsGridProps {
  posts: ObjectType[];
  className?: string;
}

const PostsGrid: React.FC<PostsGridProps> = ({ posts, className = "" }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No posts available</p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-6 auto-rows-max ${className}`}
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      }}>
      {posts.map((post) => (
        <PostItem key={post.id || post.slug} post={post} />
      ))}
    </div>
  );
};

export default PostsGrid;
