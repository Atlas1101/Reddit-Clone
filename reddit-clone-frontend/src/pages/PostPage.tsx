import { useState } from "react";
import { useParams } from "react-router-dom";

import usePost from "../hooks/usePost";
import useComments from "../hooks/useComments";
import CommentThread from "../components/Comment/CommentThread";
import CommentForm from "../components/Comment/CommentForm";

import UpvoteIcon from "../assets/upvote-icon.svg";
import DownvoteIcon from "../assets/downvote-icon.svg";
import CommentIcon from "../assets/comment-icon.svg";
import ShareIcon from "../assets/share-icon.svg";
import AwardIcon from "../assets/award-icon.svg";

import { Post } from "../types/Post";

export default function PostPage() {
    const { id } = useParams();
    console.log("PostPage: useParams id =", id);

    const { post, loading }: { post: Post | null; loading: boolean } =
        usePost(id);
    const {
        comments,
        loading: commentsLoading,
        refetchComments,
    } = useComments(id);

    const [isUpvoted, setIsUpvoted] = useState(false);
    const [isDownvoted, setIsDownvoted] = useState(false);

    if (!id) return <div className="p-4 text-red-600">Invalid post ID.</div>;
    if (loading) return <div className="p-4">Loading post...</div>;
    if (!post) return <div className="p-4 text-red-600">Post not found.</div>;

    const toggleUpvote = () => {
        setIsUpvoted(!isUpvoted);
        if (isDownvoted) setIsDownvoted(false);
    };

    const toggleDownvote = () => {
        setIsDownvoted(!isDownvoted);
        if (isUpvoted) setIsUpvoted(false);
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            {/* Post Content */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    {post.subredditIcon && (
                        <img
                            src={`http://localhost:5000${post.subredditIcon}`}
                            alt="Subreddit Icon"
                            className="w-6 h-6 rounded-full"
                        />
                    )}
                    <span className="font-medium text-black">
                        r/{post.subreddit}
                    </span>
                    <span>•</span>
                    <span>{post.createdAt}</span>
                </div>

                <h1 className="text-2xl font-semibold mb-4">{post.title}</h1>

                {post.imageUrl ? (
                    <img
                        src={`http://localhost:5000${post.imageUrl}`}
                        alt="Post Visual"
                        className="rounded-lg max-w-full max-h-[512px] object-contain mb-4"
                    />
                ) : (
                    <p className="text-gray-800 mb-4">{post.content}</p>
                )}

                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                        <button onClick={toggleUpvote}>
                            <img
                                src={UpvoteIcon}
                                alt="Upvote"
                                className="w-5 h-5"
                            />
                        </button>
                        <span>{post.score ?? 0}</span>
                        <button onClick={toggleDownvote}>
                            <img
                                src={DownvoteIcon}
                                alt="Downvote"
                                className="w-5 h-5"
                            />
                        </button>
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                        <img
                            src={CommentIcon}
                            alt="Comments"
                            className="w-5 h-5"
                        />
                        {post.commentCount > 0 && (
                            <span>{post.commentCount} Comments</span>
                        )}
                    </div>
                    <button className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                        <img src={ShareIcon} alt="Share" className="w-5 h-5" />
                        <span>Share</span>
                    </button>
                    <button className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                        <img src={AwardIcon} alt="Award" className="w-5 h-5" />
                        <span>Award</span>
                    </button>
                </div>
            </div>

            {/* Top-Level Comment Form */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <CommentForm postId={id} onSuccess={refetchComments} />
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
                {commentsLoading ? (
                    <div>Loading comments...</div>
                ) : !Array.isArray(comments) ? (
                    <div className="text-red-500">
                        Error: comments not loaded correctly.
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-gray-500">No comments yet.</div>
                ) : (
                    comments.map((comment) => (
                        <CommentThread key={comment.id} comment={comment} />
                    ))
                )}
            </div>
        </div>
    );
}
