import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../types/Post";
import { Community } from "../types/Community";
import { api } from "../services/api";
import PostCard from "../components/PostCard";

export default function CommunityPage() {
  const { name } = useParams<{ name: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const { data } = await api.get(`/communities/name/${name}`);
        setCommunity(data);

        const postRes = await api.get(`/posts?communityId=${data._id}`);

        const mappedPosts: Post[] = postRes.data.map((post: any) => ({
          id: post._id,
          title: post.title,
          content: post.content,
          author: post.author.username,
          comments: post.comment,
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

  if (loading) return <div className="p-4">Loading community...</div>;
  if (!community) return <div className="p-4">Community not found</div>;

  return (
    <div className="max-w-6xl mx-auto mt-4 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="bg-white rounded shadow p-4">
          <h1 className="text-2xl font-bold">r/{community.name}</h1>
          <p className="text-gray-600">{community.description}</p>
        </div>

        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>

      <aside className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold">About Community</h2>
        <p className="text-gray-600">{community.description}</p>
        <p className="text-sm text-gray-400 mt-2">
          Created: {new Date(community.createdAt).toLocaleDateString()}
        </p>
        {/* Add Join button, rules, members count, etc */}
      </aside>
    </div>
  );
}
