import { useState } from "react";
import PostCard from "../components/PostCard";

// Define the Post interface
interface Post {
    id: string;
    title: string;
    author: string;
    score: number;
    content: string;
    createdAt: string;
    commentCount: number;
}

export default function Home() {
    // Mock data for posts
    const mockPosts: Post[] = [
        {
            id: "1",
            title: "First Post Example",
            author: "user123",
            score: 42,
            content: "This is an example post content",
            createdAt: "2 hours ago",
            commentCount: 5
        },
        {
            id: "2",
            title: "Second Post Example",
            author: "user456",
            score: 28,
            content: "Another example post content",
            createdAt: "4 hours ago",
            commentCount: 3
        }
    ];

    return (
        <div className="space-y-4 bg-white min-h-screen p-2">
            {mockPosts.map((post) => (
                <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    author={post.author}
                    score={post.score}
                    createdAt={post.createdAt}
                    commentCount={post.commentCount}
                />
            ))}
        </div>
    );
}
