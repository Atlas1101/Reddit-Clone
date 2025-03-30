export type Comment = {
    id: string;
    postId: string;
    content: string;
    author: {
        id: string;
        username: string;
    };
    score: number;
    createdAt: string;
    replies: Comment[];
    parentComment: string | null; // ✅ Add this line
};
