import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User } from "../types/User";
import { auth } from "../services/api";
import PostCard from "../components/PostCard";
import plusIcon from "../assets/plus-icon.svg";
import caretDown from "../assets/caret-down.svg";

export default function Profile() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const tabs = ["Overview", "Posts", "Comments", "Saved", "Hidden", "Upvoted", "Downvoted"];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await auth.getCurrentUser();
                const user = userData.data;
                console.log("User data:", user);
                setUser(user);
            } catch (error) {
                console.error("Error loading user data:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUser();
    }, [id]);

    useEffect(() => {
        const fetchPosts = async () => {
          if (!user?._id) return;
      
          try {
            const response = await fetch(`/api/posts?authorId=${user._id}`, {
              credentials: "include", // ✅ חובה עם cookies
            });
      
            const data = await response.json(); // אתה כבר לא צריך text אם אתה מקבל JSON
            console.log("Posts:", data);
            setPosts(data);
          } catch (error) {
            console.error("Error fetching user's posts:", error);
          }
        };
      
        fetchPosts();
      }, [user]);
   

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="w-screen overflow-hidden max-w-4xl mx-auto">
            <div className="bg-blue-500 h-32 w-full rounded-t-lg relative ">
                <div className="absolute inset-x-0 -bottom-16 flex justify-start">
                    <div className="bg-gray-300 rounded-full h-24 w-24 border-4 border-white"></div>
                </div>
            </div>
            <div className="text-start mt-20 ml-5">
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p className="text-gray-600">u/{user.username}</p>
            </div>
            <div className="mt-4 px-4">
                <details className="group cursor-pointer">
                    <summary className="flex justify-between items-center text-gray-800 font-semibold" onClick={() => setIsAboutOpen(!isAboutOpen)}>
                        <span>About</span>
                        <img
                        src={caretDown}
                        alt="caret icon"
                        className={`transform transition-transform duration-300 ${isAboutOpen ? "rotate-180" : "rotate-0"}`}
                    />

                    </summary>
                    <div className="pl-4 text-gray-600">This is the about section. Content to be added later.</div>
                </details>
            </div>
            <div className="flex justify-center mt-4 overflow-x-scroll no-scrollbar px-4">
                <div className="flex space-x-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1 text-sm font-semibold whitespace-nowrap ${
                                activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4 px-4 flex gap-3 items-center">
                <button className="flex items-center space-x-2 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100">
                    <img src={plusIcon} alt="create icon" />
                    <span>Create Post</span>
                </button>
                <div className="text-gray-400 flex">
                    <p>New </p>
                    <img src={caretDown} alt="open tags" />
                </div>
            </div>
            <div className="mt-4 px-4 pb-4">
            <div className="mt-4 px-4 pb-4">
  {activeTab === "Posts" && (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post: any) => (
            <PostCard
            key={post._id}
            id={post._id}
            title={post.title}
            author={post.author?.username || "Unknown"}
            score={post.upvotes?.length - post.downvotes?.length || 0} // אם יש לך לוגיקת הצבעות
            comments={post.commentCount || 0}
            createdAt={new Date(post.createdAt).toLocaleDateString()}
            body={post.content}
            imageUrl={post.imageUrl}
            subreddit={post.subreddit}
            subredditIcon={post.subredditIcon}
            subredditDescription={post.subredditDescription}
            subredditBanner={post.subredditBanner}
            communityId={post.communityId}
          />
        ))
      ) : (
        <p className="text-gray-500">No posts yet.</p>
      )}
    </div>
  )}
        {activeTab === "Overview" && (
        <div className="text-gray-700 text-sm p-4">
            <p>This is the overview tab. Nothing to see here... yet.</p>
        </div>
        )}

        {activeTab === "Comments" && (
        <div className="text-gray-700 text-sm p-4">
            <p>User comments will go here in the future.</p>
        </div>
        )}
</div>

            </div>
        </div>
    );
}
