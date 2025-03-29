import { useForm } from "react-hook-form";
import { useState } from "react";
import { useParams } from "react-router-dom";

type Props = {
    parentId?: string | null; // Optional for top-level comments
    onSuccess?: () => void; // Optional callback after submission
};

type FormData = {
    content: string;
};

export default function CommentForm({ parentId = null, onSuccess }: Props) {
    const { id } = useParams(); // Get postId from URL
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<FormData>();

    console.log("💬 CommentForm params:", { postId: id, parentId });

    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        setError(null);
        if (!id) {
            setError("No post ID found in URL");
            return;
        }

        try {
            console.log("🧾 Submitting comment:", {
                content: data.content,
                postId: id,
                parentCommentId: parentId,
            });

            const res = await fetch("http://localhost:5000/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // For auth
                body: JSON.stringify({
                    ...data,
                    postId: id, // Use id from useParams
                    ...(parentId ? { parentComment: parentId } : {}),
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to submit comment");
            }

            reset(); // Clear form
            onSuccess?.(); // Trigger callback (e.g., close form or refetch)
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
                        onClick={onSuccess}
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
