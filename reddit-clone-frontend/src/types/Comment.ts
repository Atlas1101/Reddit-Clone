export type Comment = {
    id: string;
    author: {
        _id: string;
        username: string;
    };
    content: string;
    score: number;
    createdAt: string;
    replies?: Comment[];
    isCollapsed?: boolean;
};
