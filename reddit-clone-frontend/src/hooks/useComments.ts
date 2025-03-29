import { useEffect, useState, useCallback } from "react";
import { Comment } from "../types/Comment";

export default function useComments(postId: string | undefined) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(() => {
        if (!postId) return;

        setLoading(true);

        fetch(`http://localhost:5000/api/comments/post/${postId}`)
            .then((res) => res.json())
            .then((data: Comment[]) => {
                setComments(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [postId]); // ✅ React knows to re-create if postId changes

    useEffect(() => {
        fetchComments();
    }, [fetchComments]); // ✅ now fetchComments is safe and tracked

    return { comments, loading, refetchComments: fetchComments };
}
