import { Comment } from "../../types/Comment";
import CommentCard from "./CommentCard";

export default function CommentThread({
    comment,
    depth = 0,
}: {
    comment: Comment;
    depth?: number;
}) {
    return (
        <div className={`ml-${depth * 4} space-y-2`}>
            <CommentCard comment={comment} />
            {comment.replies?.map((reply) => (
                <CommentThread
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                />
            ))}
        </div>
    );
}
