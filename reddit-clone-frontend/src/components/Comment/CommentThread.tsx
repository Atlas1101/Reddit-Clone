import { Comment } from "../../types/Comment";
import CommentCard from "./CommentCard";

type Props = {
    comment: Comment;
    depth?: number;
    onReplySuccess: (newComment: Comment) => void;
};

export default function CommentThread({
    comment,
    depth = 0,
    onReplySuccess,
}: Props) {
    return (
        // Using inline style for dynamic left margin
        <div style={{ marginLeft: depth * 16 }} className="space-y-2">
            <CommentCard comment={comment} onReplySuccess={onReplySuccess} />
            {comment.replies?.map((reply) => (
                <CommentThread
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    onReplySuccess={onReplySuccess}
                />
            ))}
        </div>
    );
}

// import { Comment } from "../../types/Comment";
// import CommentCard from "./CommentCard";

// export default function CommentThread({
//     comment,
//     depth = 0,
// }: {
//     comment: Comment;
//     depth?: number;
// }) {
//     return (
//         <div className={`ml-${depth * 4} space-y-2`}>
//             <CommentCard comment={comment} />
//             {comment.replies?.map((reply) => (
//                 <CommentThread
//                     key={reply.id}
//                     comment={reply}
//                     depth={depth + 1}
//                 />
//             ))}
//         </div>
//     );
// }
