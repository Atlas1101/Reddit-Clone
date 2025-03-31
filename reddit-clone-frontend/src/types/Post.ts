// types/Post.ts
export type Post = {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    score: number;
    comments: number;
    postType: "text" | "image" | "link" | "poll";
    subreddit?: string;
    subredditIcon?: string;
    subredditDescription?: string;
    subredditBanner?: string;
    communityId?: string;
    imageUrl?: string;
};
