import PostCard from "../components/PostCard";

const dummyPosts = [
    {
        id: "1",
        title: "First Post",
        author: "user123",
        score: 23,
        comments: 5,
        createdAt: "2 hours ago",
        body: "This is the body of the first post...",
    },
    {
        id: "2",
        title: "Another one",
        author: "user456",
        score: 87,
        comments: 12,
        createdAt: "5 hours ago",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
];

export default function Home() {
    return (
        <div className="space-y-4 bg-gray-100 min-h-screen p-4">
            {dummyPosts.map((post) => (
                <PostCard key={post.id} {...post} />
            ))}
        </div>
    );
}
