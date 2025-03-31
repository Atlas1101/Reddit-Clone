// hooks/usePost.ts
import { useState, useEffect } from "react";
import { Post } from "../types/Post";

export default function usePost(id: string | undefined) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null); // For more detailed error handling

    useEffect(() => {
        if (!id) {
            console.warn("usePost: called with undefined id");
            setLoading(false);
            setError("Post ID is undefined");
            return;
        }

        console.log("usePost: useEffect triggered - Fetching post with id", id);

        fetch(`http://localhost:5000/api/posts/${id}`)
            .then(async (res) => {
                console.log("usePost: fetch response:", res); // Log the initial response

                if (!res.ok) {
                    const text = await res.text(); // Get raw response body
                    const errorMessage = `HTTP error! status: ${res.status}, body: ${text}`;
                    console.error("usePost: HTTP error!", errorMessage);
                    setError(errorMessage);
                    throw new Error(errorMessage);
                }

                try {
                    const rawResponse = await res.clone().text(); // Clone for logging
                    console.log("usePost: Raw response body:", rawResponse);
                    const data = await res.json();
                    console.log("usePost: Parsed JSON data:", data);
                    return data;
                } catch (jsonError) {
                    console.error("usePost: JSON parsing error", jsonError);
                    setError(jsonError);
                    throw jsonError;
                }
            })
            .then((data: Post) => {
                console.log("usePost: Successfully fetched post data:", data);
                setPost(data);
                setLoading(false);
                setError(null); // Clear any previous errors
            })
            .catch((fetchError) => {
                console.error("usePost: fetch operation failed:", fetchError);
                setLoading(false);
                setPost(null); // Ensure post is null on error
                setError(fetchError);
            });

        // Cleanup function (important to prevent memory leaks)
        return () => {
            console.log("usePost: useEffect cleanup - fetch aborted (if any)");
            // You might want to add logic here to abort the fetch if it's still in progress
            // (using AbortController), but for simplicity, I'm omitting it.
        };
    }, [id]);

    return { post, loading, error }; // Return the error state
}
