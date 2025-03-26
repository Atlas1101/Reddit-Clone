import PostCard from "../components/PostCard";
import randomImage from "../assets/random.jpg";
import { useEffect, useState } from "react";
import { api } from "../services/api";

// const dummyPosts = [
//     {
//         id: "1",
//         title: "First Post",
//         author: "user123",
//         score: 23,
//         comments: 5,
//         createdAt: "2 hours ago",
//         body: "This is the body of the first post...",
//     },
//     {
//         id: "2",
//         title: "Another one",
//         author: "user456",
//         score: 87,
//         comments: 12,
//         createdAt: "5 hours ago",
//         body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     },
//     {
//         id: "3",
//         title: "Another nother' one",
//         author: "user4526",
//         score: 87,
//         comments: 12,
//         createdAt: "5 hours ago",
//         body: "",
//         imageUrl: randomImage,
//     },
// ];

type Post = {
    id: string;
    title: string;
    author: string;
    score: number;
    comments: number;
    createdAt: string;
    body?: string;
    imageUrl?: string;
    subreddit?: string;
};

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    useEffect(() => {
        api.get("/posts")
            .then((res) => {
                console.log("Fetched posts:", res.data);
                setPosts(res.data);
            })
            .catch((err) => console.error("Failed to load posts", err));
    }, []);

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard key={post.id} {...post} />
            ))}
        </div>
    );
}
