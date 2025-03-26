// hooks/usePost.ts
import { useState, useEffect } from "react";
import { Post } from "../types/Post";

export default function usePost(id: string | undefined) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            console.warn("usePost: called with undefined id");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:5000/api/posts/${id}`)
            .then((res) => res.json())
            .then((data: Post) => {
                setPost(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    return { post, loading };
}
