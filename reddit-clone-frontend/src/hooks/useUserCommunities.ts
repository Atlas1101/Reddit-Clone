import { useState, useEffect } from "react";

type Subreddit = {
    _id: string;
    name: string;
    icon: string;
    memberCount: number;
};

export default function useUserCommunities() {
    const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const res = await fetch(
                    "http://localhost:5000/api/users/me/communities",
                    {
                        credentials: "include", // ✅ this sends the cookie!
                    }
                );

                if (!res.ok) throw new Error("Failed to load communities");

                const data = await res.json();
                setSubreddits(data);
            } catch (err) {
                setError("Error loading communities");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    return { subreddits, loading, error };
}
