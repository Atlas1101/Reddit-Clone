// components/Comment/CommentForm.tsx
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Comment } from "../../types/Comment";

type Props = {
    parentId?: string | null;
    onSuccess?: (newComment: Comment) => void;
};

type FormData = {
    content: string;
};

export default function CommentForm({ parentId = null, onSuccess }: Props) {
    const { id } = useParams();
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<FormData>();
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        setError(null);
        if (!id) {
            setError("No post ID found in URL");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    ...data,
                    postId: id,
                    ...(parentId ? { parentCommentId: parentId } : {}),
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to submit comment");
            }

            const responseJson = await res.json();
            // The back end now returns the new comment with an "id" field
            const newComment: Comment = responseJson.comment;
            reset();
            onSuccess?.(newComment);
        } catch (err: any) {
            setError(err.message || "Unknown error");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <textarea
                {...register("content", { required: true })}
                placeholder="What are your thoughts?"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 justify-end">
                {onSuccess && (
                    <button
                        type="button"
                        onClick={() => {
                            // Optionally call onSuccess with no new comment to cancel reply mode.
                            onSuccess(null as any);
                        }}
                        className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                    {isSubmitting ? "Posting..." : "Comment"}
                </button>
            </div>
        </form>
    );
}

// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { Comment } from "../../types/Comment"; // Import Comment type

// type Props = {
//     parentId?: string | null;
//     onSuccess?: (newComment: Comment) => void; // Change onSuccess type
// };

// type FormData = {
//     content: string;
// };

// export default function CommentForm({ parentId = null, onSuccess }: Props) {
//     const { id } = useParams();
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { isSubmitting },
//     } = useForm<FormData>();

//     const [error, setError] = useState<string | null>(null);

//     const onSubmit = async (data: FormData) => {
//         setError(null);
//         if (!id) {
//             setError("No post ID found in URL");
//             return;
//         }

//         try {
//             const res = await fetch("http://localhost:5000/api/comments", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 credentials: "include",
//                 body: JSON.stringify({
//                     ...data,
//                     postId: id,
//                     ...(parentId ? { parentComment: parentId } : {}),
//                 }),
//             });

//             if (!res.ok) {
//                 throw new Error("Failed to submit comment");
//             }

//             const newComment: Comment = await res.json(); // ✅ Get the new comment from the response

//             reset();
//             onSuccess?.(newComment); // ✅ Pass the new comment to onSuccess
//         } catch (err: any) {
//             setError(err.message || "Unknown error");
//         }
//     };
//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
//             <textarea
//                 {...register("content", { required: true })}
//                 placeholder="What are your thoughts?"
//                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 rows={3}
//             />
//             {error && <p className="text-sm text-red-500">{error}</p>}
//             <div className="flex gap-2 justify-end">
//                 {onSuccess && (
//                     <button
//                         type="button"
//                         onClick={onSuccess}
//                         className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
//                     >
//                         Cancel
//                     </button>
//                 )}
//                 <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
//                 >
//                     {isSubmitting ? "Posting..." : "Comment"}
//                 </button>
//             </div>
//         </form>
//     );
// }
