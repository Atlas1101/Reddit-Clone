import PostCard from "../components/PostCard";
import randomImage from "../assets/random.png";

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
    {
        id: "3",
        title: "Another nother' one",
        author: "user4526",
        score: 87,
        comments: 12,
        createdAt: "5 hours ago",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        imageUrl: randomImage,  
    },
];

export default function Home() {
    return (
        <div className="space-y-4 bg-white min-h-screen p-2">
            {dummyPosts.map((post) => (
                <PostCard key={post.id} {...post} />
            ))}
        </div>
    );
}
