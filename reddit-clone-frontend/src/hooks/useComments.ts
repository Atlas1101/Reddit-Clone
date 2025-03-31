// hooks/useComments.ts
import { useEffect, useState, useCallback } from "react";
import { Comment } from "../types/Comment";

interface ApiCommentsResponse {
    comments: Comment[];
    totalComments: number;
    totalPages: number;
    currentPage: number;
}

const useComments = (postId: string | undefined, pageSize: number = 10) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [pendingNewComment, setPendingNewComment] = useState<Comment | null>(
        null
    );

    // Fetch comments when postId or page changes
    useEffect(() => {
        if (!postId) return;

        const fetchComments = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    pageSize: pageSize.toString(),
                });
                // Updated URL to match your back‑end route (/post/:postId)
                const url = `http://localhost:5000/api/comments/post/${postId}?${params.toString()}`;
                console.log("Fetching comments from:", url); // Debug log
                const res = await fetch(url, { credentials: "include" });
                if (!res.ok) throw new Error("Failed to fetch comments");
                const result: ApiCommentsResponse = await res.json();

                // If page === 1, replace comments; otherwise append
                setComments((prev) =>
                    page === 1 ? result.comments : [...prev, ...result.comments]
                );
                setHasNextPage(page < result.totalPages);
            } catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId, page, pageSize]);

    // Recursively insert new reply into comment tree
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

    // Add new comment (top‑level or reply)
    useEffect(() => {
        if (!pendingNewComment) return;

        if (pendingNewComment.parentComment === null) {
            setComments((prev) => [pendingNewComment, ...prev]);
        } else {
            setComments((prev) => insertReply(prev, pendingNewComment));
        }
    }, [pendingNewComment]);

    const loadMore = useCallback(() => {
        if (!hasNextPage || loading) return;
        setPage((prev) => prev + 1);
    }, [hasNextPage, loading]);

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
