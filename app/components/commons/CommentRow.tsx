import { Comment } from "@server/models/Comment";
import { formatDistance } from "date-fns";

export interface CommentRowProps {
  comment: Comment;
}

export const CommentRow = ({ comment }: CommentRowProps) => {
  return (
    <div className="flex flex-col gap-2 text-base rounded-sm p-2 mb-2">
      <div className="flex flex-row gap-2 text-xs">
        <span className="font-bold">{comment.author.name}</span>
        <span className="text-gray-500">{formatDistance(new Date(), new Date(comment.createdAt))}</span>
      </div>
      <div className="text-sm">{comment.content}</div>
    </div>
  );
};
