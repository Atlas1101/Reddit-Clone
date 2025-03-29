// components/Comment/CommentForm.tsx
import { useForm } from "react-hook-form";
import { useState } from "react";

type Props = {
    postId: string;
    parentId?: string | null;
    onSuccess?: () => void;
};

type FormData = {
    content: string;
};

export default function CommentForm({
    postId,
    parentId = null,
    onSuccess,
}: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<FormData>();

    console.log("💬 CommentForm props:", { postId, parentId });

    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        setError(null);
        try {
            const res = await fetch("http://localhost:5000/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ <---- this line is critical
                body: JSON.stringify({
                    ...data,
                    postId,
                    ...(parentId ? { parentCommentId: parentId } : {}), // only include if it's a string
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to submit comment");
            }

            reset(); // clear form
            onSuccess?.(); // collapse reply box
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
