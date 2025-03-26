import { useState } from "react";
import { useParams } from "react-router-dom";
import usePost from "../hooks/usePost";
import useComments from "../hooks/useComments";
import CommentThread from "../components/Comment/CommentThread";

import UpvoteIcon from "../assets/upvote-icon.svg";
import DownvoteIcon from "../assets/downvote-icon.svg";
import CommentIcon from "../assets/comment-icon.svg";
import ShareIcon from "../assets/share-icon.svg";
import AwardIcon from "../assets/award-icon.svg";

//  ✅ Type matching backend response structure
import { Post } from "../types/Post";

export default function PostPage() {
    const { id } = useParams();
    //deeeeeeeeeeeeeeeebuggggggggggggg
    console.log("PostPage: useParams id =", id);

    // ✅ Always call hooks
    const { post, loading }: { post: Post | null; loading: boolean } =
        usePost(id);
    const { comments, loading: commentsLoading } = useComments(id);

    const [isUpvoted, setIsUpvoted] = useState(false);
    const [isDownvoted, setIsDownvoted] = useState(false);
    const [commentText, setCommentText] = useState("");

    // ✅ Handle bad ID after hooks are run
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

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting comment:", commentText);
        setCommentText("");
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

            {/* Comment Form */}
            <form
                onSubmit={handleSubmitComment}
                className="bg-white rounded-lg shadow p-4 mb-4"
            >
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

// import { useState } from "react";
// import { useParams } from "react-router-dom";

// import usePost from "../hooks/usePost";
// import CommentThread, { Comment } from "../components/Comment/CommentThread";

// import UpvoteIcon from "../assets/upvote-icon.svg";
// import DownvoteIcon from "../assets/downvote-icon.svg";
// import CommentIcon from "../assets/comment-icon.svg";
// import ShareIcon from "../assets/share-icon.svg";
// import AwardIcon from "../assets/award-icon.svg";

// type Comment = {
//     id: string;
//     author: string;
//     content: string;
//     score: number;
//     createdAt: string;
//     replies?: Comment[];
//     isCollapsed?: boolean;
// };

// export default function PostPage() {
//     const { id } = useParams();
//     const { post, loading } = usePost(id);
//     const [isUpvoted, setIsUpvoted] = useState(false);
//     const [isDownvoted, setIsDownvoted] = useState(false);
//     const [commentText, setCommentText] = useState("");

//     if (loading) return <div className="p-4">Loading post...</div>;
//     if (!post) return <div className="p-4 text-red-600">Post not found.</div>;

//     const toggleUpvote = () => {
//         setIsUpvoted(!isUpvoted);
//         if (isDownvoted) setIsDownvoted(false);
//     };

//     const toggleDownvote = () => {
//         setIsDownvoted(!isDownvoted);
//         if (isUpvoted) setIsUpvoted(false);
//     };

//     const handleSubmitComment = (e: React.FormEvent) => {
//         e.preventDefault();
//         // Handle comment submission
//         console.log("Submitting comment:", commentText);
//         setCommentText("");
//     };

//     const CommentComponent = ({
//         comment,
//         depth = 0,
//     }: {
//         comment: Comment;
//         depth?: number;
//     }) => {
//         const [isCollapsed, setIsCollapsed] = useState(
//             comment.isCollapsed || false
//         );

//         const toggleCollapse = () => {
//             setIsCollapsed(!isCollapsed);
//         };

//         return (
//             <div className={`ml-${depth * 4}`}>
//                 <div className="bg-white rounded p-3 mb-2 border border-gray-200">
//                     <div className="flex items-center space-x-2 text-sm text-gray-500">
//                         {comment.replies && comment.replies.length > 0 && (
//                             <button
//                                 onClick={toggleCollapse}
//                                 className="text-gray-500 hover:text-gray-700 focus:outline-none"
//                             >
//                                 {isCollapsed ? "[+]" : "[-]"}
//                             </button>
//                         )}
//                         <span className="font-semibold text-gray-700">
//                             {comment.author}
//                         </span>
//                         <span>•</span>
//                         <span>{comment.createdAt}</span>
//                     </div>
//                     <p className="my-2">{comment.content}</p>
//                     <div className="flex items-center space-x-4 text-sm">
//                         <div className="flex items-center space-x-1">
//                             <button
//                                 onClick={toggleUpvote}
//                                 className={`hover:bg-gray-100 rounded ${
//                                     isUpvoted ? "text-orange-500" : ""
//                                 }`}
//                             >
//                                 <img
//                                     src={UpvoteIcon}
//                                     alt="Upvote"
//                                     className="w-4 h-4"
//                                 />
//                             </button>
//                             <span
//                                 className={`${
//                                     isUpvoted
//                                         ? "text-orange-500"
//                                         : isDownvoted
//                                         ? "text-blue-500"
//                                         : ""
//                                 }`}
//                             >
//                                 {comment.score}
//                             </span>
//                             <button
//                                 onClick={toggleDownvote}
//                                 className={`hover:bg-gray-100 rounded ${
//                                     isDownvoted ? "text-blue-500" : ""
//                                 }`}
//                             >
//                                 <img
//                                     src={DownvoteIcon}
//                                     alt="Downvote"
//                                     className="w-4 h-4"
//                                 />
//                             </button>
//                         </div>
//                         <button className="text-gray-500 hover:text-gray-700">
//                             Reply
//                         </button>
//                     </div>
//                 </div>
//                 {!isCollapsed &&
//                     comment.replies?.map((reply) => (
//                         <CommentComponent
//                             key={reply.id}
//                             comment={reply}
//                             depth={depth + 1}
//                         />
//                     ))}
//             </div>
//         );
//     };

//     return (
//         <div className="max-w-3xl mx-auto p-4">
//             {/* Post Content */}
//             <div className="bg-white rounded-lg shadow p-4 mb-4">
//                 <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
//                     <span>Posted by u/{post.author}</span>
//                     <span>•</span>
//                     <span>{post.createdAt}</span>
//                 </div>
//                 <h1 className="text-2xl font-semibold mb-4">{post.title}</h1>
//                 <p className="text-gray-800 mb-4">{post.content}</p>
//                 <div className="flex items-center space-x-4 text-sm">
//                     <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
//                         <button onClick={toggleUpvote}>
//                             <img
//                                 src={UpvoteIcon}
//                                 alt="Upvote"
//                                 className="w-5 h-5"
//                             />
//                         </button>
//                         <span>{post.score}</span>
//                         <button onClick={toggleDownvote}>
//                             <img
//                                 src={DownvoteIcon}
//                                 alt="Downvote"
//                                 className="w-5 h-5"
//                             />
//                         </button>
//                     </div>
//                     <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
//                         <img
//                             src={CommentIcon}
//                             alt="Comments"
//                             className="w-5 h-5"
//                         />
//                         {post.commentCount > 0 && (
//                             <span>{post.commentCount} Comments</span>
//                         )}
//                     </div>
//                     <button className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
//                         <img src={ShareIcon} alt="Share" className="w-5 h-5" />
//                         <span>Share</span>
//                     </button>
//                     <button className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
//                         <img src={AwardIcon} alt="Award" className="w-5 h-5" />
//                         <span>Award</span>
//                     </button>
//                 </div>
//             </div>

//             {/* Comment Form */}
//             <form
//                 onSubmit={handleSubmitComment}
//                 className="bg-white rounded-lg shadow p-4 mb-4"
//             >
//                 <textarea
//                     value={commentText}
//                     onChange={(e) => setCommentText(e.target.value)}
//                     placeholder="What are your thoughts?"
//                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows={4}
//                 />
//                 <div className="flex justify-end mt-2">
//                     <button
//                         type="submit"
//                         className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50"
//                         disabled={!commentText.trim()}
//                     >
//                         Comment
//                     </button>
//                 </div>
//             </form>

//             {/* Comments Section */}
//             <div className="space-y-4">
//                 {comments.map((comment) => (
//                     <CommentComponent key={comment.id} comment={comment} />
//                 ))}
//             </div>
//         </div>
//     );
// }
