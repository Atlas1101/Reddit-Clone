// components/Comment/CommentCard.tsx
import { useState } from "react";
import { Comment } from "../../types/Comment";
import CommentForm from "./CommentForm";

type Props = {
    comment: Comment;
    onReplySuccess: (newComment: Comment) => void;
};

export default function CommentCard({ comment, onReplySuccess }: Props) {
    const [replying, setReplying] = useState(false);

    return (
        <div className="bg-white border rounded p-2">
            <div className="text-sm font-semibold">
                {comment.author.username}
            </div>
            <div className="text-gray-800">{comment.content}</div>
            <div className="flex gap-4 mt-1 text-xs text-gray-500">
                <button
                    onClick={() => setReplying(!replying)}
                    className="hover:underline"
                >
                    Reply
                </button>
                <span>• {comment.score} points</span>
                <span>• {new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            {replying && (
                <div className="mt-2">
                    <CommentForm
                        postId={comment.postId}
                        parentId={comment.id}
                        onSuccess={(newReply) => {
                            onReplySuccess(newReply);
                            setReplying(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}

// // components/Comment/CommentCard.tsx
// import { useState } from "react";
// import { Comment } from "../../types/Comment";
// import CommentForm from "./CommentForm";

// type Props = {
//     comment: Comment;
// };

// export default function CommentCard({ comment }: Props) {
//     const [replying, setReplying] = useState(false);

//     return (
//         <div className="bg-white border rounded p-2">
//             <div className="text-sm font-semibold">
//                 {comment.author.username}
//             </div>
//             <div className="text-gray-800">{comment.content}</div>

//             <div className="flex gap-4 mt-1 text-xs text-gray-500">
//                 <button
//                     onClick={() => setReplying(!replying)}
//                     className="hover:underline"
//                 >
//                     Reply
//                 </button>
//                 <span>• {comment.score} points</span>
//                 <span>• {new Date(comment.createdAt).toLocaleString()}</span>
//             </div>

//             {replying && (
//                 <div className="mt-2">
//                     <CommentForm
//                         postId={comment.postId}
//                         parentId={comment.id}
//                         onSuccess={() => setReplying(false)}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// }
