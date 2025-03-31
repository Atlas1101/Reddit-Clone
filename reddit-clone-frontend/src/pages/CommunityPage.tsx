import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../types/Post";
import { Community } from "../types/Community";
import { api } from "../services/api";
import PostCard from "../components/PostCard";
import { useUser } from "../context/UserContext";
import { User } from "../types/User";

export default function CommunityPage() {
    const { name } = useParams<{ name: string }>();
    const { user, fetchUser } = useUser(); // 🧠 grab user
    const [community, setCommunity] = useState<Community | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
  
    const isMember = user?.subscribedCommunities?.some(c => c._id === community?._id);
  
    useEffect(() => {
      const fetchCommunity = async () => {
        try {
          const { data } = await api.get(`/communities/name/${name}`);
          setCommunity(data);
  
          const postRes = await api.get(`/posts?communityId=${data._id}`);
          const mappedPosts = postRes.data.map((post: any) => ({
            id: post._id,
            title: post.title,
            content: post.content,
            author: post.author.username,
            comments: post.commentsCount,
            createdAt: post.createdAt,
            score: post.score ?? 0,
            postType: post.postType,
            imageUrl: post.imageUrl,
            subreddit: post.subreddit,
            subredditIcon: post.subredditIcon,
            subredditDescription: post.subredditDescription,
            subredditBanner: post.subredditBanner,
            communityId: post.communityId,
          }));
          setPosts(mappedPosts);
        } catch (error) {
          console.error("Error loading community:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCommunity();
    }, [name]);
  
    const handleJoinLeave = async () => {
      if (!community) return;
      setIsJoining(true);
      try {
        if (isMember) {
          await api.post(`/communities/${community._id}/leave`);
        } else {
          await api.post(`/communities/${community._id}/join`);
        }
        await fetchUser(); // 👈 refresh user data
      } catch (error) {
        console.error("Failed to update community membership", error);
      } finally {
        setIsJoining(false);
      }
    };
  
    if (loading) return <div className="p-4">Loading community...</div>;
    if (!community) return <div className="p-4">Community not found</div>;
  
    return (
      <div>
        {/* 🧩 Banner */}
        <div className="w-full h-32 bg-cover bg-center relative" style={{ backgroundImage: `url(${community.banner})` }}>
          <div className="absolute bottom-0 left-4 transform translate-y-1/2">
            <img
              src={community.icon || "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png"}
              className="w-20 h-20 rounded-full border-4 border-white"
              alt="Community Icon"
            />
          </div>
        </div>
  
        {/* 🧩 Header */}
        <div className="flex justify-between items-center mt-12 px-4 md:px-8">
          <div>
            <h1 className="text-2xl font-bold">r/{community.name}</h1>
            <p className="text-gray-500 text-sm">{community.members.length} members</p>
          </div>
          <button
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              isMember ? "bg-gray-300 text-black" : "bg-blue-600 text-white"
            }`}
            disabled={isJoining}
            onClick={handleJoinLeave}
          >
            {isJoining ? "Loading..." : isMember ? "Leave" : "Join"}
          </button>
        </div>
  
        {/* 🧩 Main Content */}
        <div className="max-w-6xl mx-auto mt-4 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} {...post} />
            ))}
          </div>
  
          {/* Sidebar */}
          <aside className="bg-white rounded shadow p-4 space-y-2">
            <h2 className="text-lg font-semibold">About Community</h2>
            <p className="text-gray-600">{community.description}</p>
            <p className="text-sm text-gray-400 mt-2">
              Created: {new Date(community.createdAt).toLocaleDateString()}
            </p>
          </aside>
        </div>
      </div>
    );
  }
  