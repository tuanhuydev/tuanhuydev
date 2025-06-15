import { PostItem } from "./PostItem";

export interface BentoGridProps {
  featurePosts: ObjectType[];
  className?: string;
}

const BentoGrid: React.FC<BentoGridProps> = ({ featurePosts, className = "" }) => {
  const posts = featurePosts.slice(0, 3);

  if (posts.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-[300px] bg-gray-100 dark:bg-gray-800 rounded-xl ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No featured posts available</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <PostItem key={post.id || index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default BentoGrid;
