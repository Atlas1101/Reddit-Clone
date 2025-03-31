import { useState, useEffect } from "react";

interface UseVoteOptions {
    entityId: string;
    entityType: "post" | "comment";
    initialVote?: number; // 1, -1, or 0
}

export function useVote({
    entityId,
    entityType,
    initialVote = 0,
}: UseVoteOptions) {
    const [userVote, setUserVote] = useState<number>(initialVote);
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        const fetchScore = async () => {
            const res = await fetch(
                `http://localhost:5000/api/votes/score?type=${entityType}&id=${entityId}`,
                { credentials: "include" }
            );
            if (res.ok) {
                const data = await res.json();
                setScore(data.score);
            }
        };
        fetchScore();
    }, [entityId, entityType]);

    const castVote = async (voteType: 1 | -1 | 0) => {
        const res = await fetch("http://localhost:5000/api/votes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                voteType,
                targetId: entityId,
                targetType: entityType,
            }),
        });

        if (res.ok) {
            const data = await res.json();
            setUserVote(data.userVote);
            setScore(data.score);
        } else {
            console.error("Vote failed");
        }
    };

    return {
        score,
        userVote,
        upvoted: userVote === 1,
        downvoted: userVote === -1,
        castVote,
    };
}
