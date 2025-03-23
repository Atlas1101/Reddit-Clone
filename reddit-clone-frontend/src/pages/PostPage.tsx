import { useState } from "react";
import { useParams } from "react-router-dom";

import UpvoteIcon from "../assets/upvote-icon.svg";
import DownvoteIcon from "../assets/downvote-icon.svg";
import CommentIcon from "../assets/comment-icon.svg";
import ShareIcon from "../assets/share-icon.svg";
import AwardIcon from "../assets/award-icon.svg";

type Comment = {
    id: string;
    author: string;
    content: string;
    score: number;
    createdAt: string;
    replies?: Comment[];
};

export default function PostPage() {
    const { id } = useParams();
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [isDownvoted, setIsDownvoted] = useState(false);
    const [commentText, setCommentText] = useState("");

    // Dummy data - replace with actual API call
    const post = {
        id: id,
        title: "Example Post Title",
        author: "user123",
        content: "This is the full content of the post. It can be quite long and contain multiple paragraphs.",
        score: 42,
        createdAt: "2 hours ago",
        subreddit: "exampleSub",
        commentCount: 5,
    };

    const comments: Comment[] = [
        {
            id: "1",
            author: "commenter1",
            content: "This is a top-level comment",
            score: 15,
            createdAt: "1 hour ago",
            replies: [
                {
                    id: "2",
                    author: "replier1",
                    content: "This is a reply to the top comment",
                    score: 8,
                    createdAt: "30 minutes ago",
                },
            ],
        },
    ];

    const toggleUpvote = () => {
        setIsUpvoted(!isUpvoted);
        if (isDownvoted) setIsDownvoted(false);
    };

    const toggleDownvote = () => {
        setIsDownvoted(!isDownvoted);
        if (isUpvoted) setIsUpvoted(false);
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle comment submission
        console.log("Submitting comment:", commentText);
        setCommentText("");
    };

    const CommentComponent = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
        <div className={`ml-${depth * 4}`}>
            <div className="bg-white rounded p-3 mb-2">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">{comment.author}</span>
                    <span>•</span>
                    <span>{comment.createdAt}</span>
                </div>
                <p className="my-2">{comment.content}</p>
                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                        <button onClick={toggleUpvote}>
                            <img src={UpvoteIcon} alt="Upvote" className="w-4 h-4" />
                        </button>
                        <span>{comment.score}</span>
                        <button onClick={toggleDownvote}>
                            <img src={DownvoteIcon} alt="Downvote" className="w-4 h-4" />
                        </button>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700">Reply</button>
                </div>
            </div>
            {comment.replies?.map((reply) => (
                <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
            ))}
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto p-4">
            {/* Post Content */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <span>Posted by u/{post.author}</span>
                    <span>•</span>
                    <span>{post.createdAt}</span>
                </div>
                <h1 className="text-2xl font-semibold mb-4">{post.title}</h1>
                <p className="text-gray-800 mb-4">{post.content}</p>
                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                        <button onClick={toggleUpvote}>
                            <img src={UpvoteIcon} alt="Upvote" className="w-5 h-5" />
                        </button>
                        <span>{post.score}</span>
                        <button onClick={toggleDownvote}>
                            <img src={DownvoteIcon} alt="Downvote" className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                        <img src={CommentIcon} alt="Comments" className="w-5 h-5" />
                        <span>{post.commentCount} Comments</span>
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

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="bg-white rounded-lg shadow p-4 mb-4">
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                />
                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50"
                        disabled={!commentText.trim()}
                    >
                        Comment
                    </button>
                </div>
            </form>

            {/* Comments Section */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentComponent key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
}
