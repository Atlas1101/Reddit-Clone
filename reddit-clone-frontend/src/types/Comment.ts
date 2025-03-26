export type Comment = {
    id: string;
    author: string;
    content: string;
    score: number;
    createdAt: string;
    replies?: Comment[];
    isCollapsed?: boolean;
};
