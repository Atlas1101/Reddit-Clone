import { Comment } from "../../types/Comment";

export default function CommentThread({
    comment,
    depth = 0,
}: {
    comment: Comment;
    depth?: number;
}) {
    return (
        <div className={`ml-${depth * 4}`}>
            {/* Your comment display logic here */}
            <div>
                {comment.author}: {comment.content}
            </div>
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
