import { useEffect, useState } from "react";
import { Comment } from "../components/Comment/CommentThread";

export default function useComments(postId: string | undefined) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!postId) {
            console.warn("useComments: called with undefined postId");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:5000/api/comments/post/${postId}`)
            .then((res) => res.json())
            .then((data) => {
                setComments(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [postId]);

    return { comments, loading };
}
