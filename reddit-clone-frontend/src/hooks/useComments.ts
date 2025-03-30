import { useEffect, useState, useCallback } from "react";
import { Comment } from "../types/Comment";

const useComments = (postId: string | undefined, limit: number = 10) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [cursor, setCursor] = useState<string | null>(null);
    const [pendingNewComment, setPendingNewComment] = useState<Comment | null>(
        null
    );

    // 🔁 Fetch comments
    useEffect(() => {
        if (!postId) return;

        const fetchComments = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({ limit: limit.toString() });
                if (cursor) params.append("cursor", cursor);

                const res = await fetch(
                    `http://localhost:5000/api/comments/${postId}?${params.toString()}`,
                    { credentials: "include" }
                );

                if (!res.ok) throw new Error("Failed to fetch comments");

                const data: Comment[] = await res.json();

                if (data.length < limit) setHasNextPage(false);
                if (data.length > 0) {
                    setCursor(data[data.length - 1].id);
                    setComments((prev) => [...prev, ...data]);
                }
            } catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId, cursor]);

    // ➕ Recursively insert new reply in the correct place
    const insertReply = (tree: Comment[], reply: Comment): Comment[] => {
        return tree.map((comment) => {
            if (comment.id === reply.parentComment) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), reply],
                };
            }

            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: insertReply(comment.replies, reply),
                };
            }

            return comment;
        });
    };

    // ➕ Add new comment (top-level or reply)
    useEffect(() => {
        if (!pendingNewComment) return;

        if (pendingNewComment.parentComment === null) {
            setComments((prev) => [pendingNewComment, ...prev]);
        } else {
            setComments((prev) => insertReply(prev, pendingNewComment));
        }
    }, [pendingNewComment]);

    // ⬇️ Load more
    const loadMore = useCallback(() => {
        if (!hasNextPage || loading || comments.length === 0) return;
        const lastId = comments[comments.length - 1].id;
        setCursor(lastId);
    }, [hasNextPage, loading, comments]);

    return {
        comments,
        loading,
        error,
        hasNextPage,
        loadMore,
        setNewComment: setPendingNewComment,
    };
};

export default useComments;
