import { useParams } from "react-router-dom";

import usePost from "../hooks/usePost";
import { useVote } from "../hooks/useVote";

import useComments from "../hooks/useComments";
import CommentThread from "../components/Comment/CommentThread";
import CommentForm from "../components/Comment/CommentForm";

import UpvoteIcon from "../assets/upvote-icon.svg";
import DownvoteIcon from "../assets/downvote-icon.svg";
import CommentIcon from "../assets/comment-icon.svg";
import ShareIcon from "../assets/share-icon.svg";
import AwardIcon from "../assets/award-icon.svg";

import { Post } from "../types/Post";
import { Comment } from "../types/Comment";

export default function PostPage() {
    const { id } = useParams();
    console.log("PostPage: useParams id =", id);

    const { post, loading }: { post: Post | null; loading: boolean } =
        usePost(id);

    const {
        comments,
        loading: commentsLoading,
        loadMore,
        hasNextPage,
        setNewComment,
    } = useComments(id, 10);

    const {
        score: localScore,
        upvoted: isUpvoted,
        downvoted: isDownvoted,
        castVote,
    } = useVote({
        entityId: id ?? ("" as string),
        entityType: "post",
    });

    if (!id) return <div className="p-4 text-red-600">Invalid post ID.</div>;
    if (loading) return <div className="p-4">Loading post...</div>;
    if (!post) return <div className="p-4 text-red-600">Post not found.</div>;

    const handleNewComment = (newComment: Comment) => {
        setNewComment(newComment);
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    {post?.subredditIcon && (
                        <img
                            src={`http://localhost:5000${post.subredditIcon}`}
                            alt="Subreddit Icon"
                            className="w-6 h-6 rounded-full"
                        />
                    )}
                    <span className="font-medium text-black">
                        r/{post?.subreddit}
                    </span>
                    <span>•</span>
                    <span>{post?.createdAt}</span>
                </div>

                <h1 className="text-2xl font-semibold mb-4">{post?.title}</h1>

                {post?.imageUrl ? (
                    <img
                        src={`http://localhost:5000${post.imageUrl}`}
                        alt="Post Visual"
                        className="rounded-lg max-w-full max-h-[512px] object-contain mb-4"
                    />
                ) : (
                    <p className="text-gray-800 mb-4">{post?.content}</p>
                )}

                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                        <button onClick={() => castVote(isUpvoted ? 0 : 1)}>
                            <img
                                src={UpvoteIcon}
                                className={`w-5 h-5 ${
                                    isUpvoted ? "text-orange-500" : ""
                                }`}
                            />
                        </button>

                        <span>{localScore}</span>

                        <button onClick={() => castVote(isDownvoted ? 0 : -1)}>
                            <img
                                src={DownvoteIcon}
                                className={`w-5 h-5 ${
                                    isDownvoted ? "text-blue-500" : ""
                                }`}
                            />
                        </button>
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                        <img
                            src={CommentIcon}
                            alt="Comments"
                            className="w-5 h-5"
                        />
<<<<<<< HEAD
                        {post.comments > 0 && (
                            <span>{post.comments} Comments</span>
=======
                        {post?.commentCount > 0 && (
                            <span>{post.commentCount} Comments</span>
>>>>>>> da468ffa8b3dd9802e4b12635f07421943295192
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

            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <CommentForm onSuccess={handleNewComment} />
            </div>

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
                        <CommentThread
                            key={comment.id} // Assuming comment.id is available, adjust if needed
                            comment={comment}
                            onReplySuccess={handleNewComment}
                        />
                    ))
                )}

                {hasNextPage && (
                    <div className="flex justify-center">
                        <button
                            onClick={loadMore}
                            className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
                        >
                            Show More Comments
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
