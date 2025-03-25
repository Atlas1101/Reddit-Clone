import { Link } from "react-router-dom";
import { useState } from "react";

import UpvoteIcon from "../assets/upvote-icon.svg";
import DownvoteIcon from "../assets/downvote-icon.svg";
import CommentIcon from "../assets/comment-icon.svg";
import ShareIcon from "../assets/share-icon.svg";
import AwardIcon from "../assets/award-icon.svg";
import CloseIcon from "../assets/close-icon.svg";
import HideIcon from "../assets/hide-icon.svg";
import ReportIcon from "../assets/report-icon.svg";
import SaveIcon from "../assets/save-icon.svg";
import { useAuthModal } from "../context/AuthModalContext";
import CommunityHoverCard from "./HoverCard/CommunityHoverCard"; // adjust path if needed

type PostProps = {
    id: string;
    title: string;
    author: string;
    score: number;
    comments: number;
    createdAt: string;
    body?: string;
    imageUrl?: string;
    subreddit?: string;
    subredditIcon?: string;
    subredditDescription?: string;
    subredditBanner?: string;
};

export default function PostCard({
    id,
    title,
    author,
    score,
    comments,
    createdAt,
    body,
    imageUrl,
    subreddit,
    subredditIcon,
    subredditDescription,
    subredditBanner,
    communityId,
}: PostProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isUpvoted, setIsUpvoted] = useState(false); // State for upvote
    const [isDownvoted, setIsDownvoted] = useState(false); // State for downvote
    const [isHoveringCommunity, setIsHoveringCommunity] = useState(false);

    console.log("PostCard imageUrl:", imageUrl);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const toggleOptions = () => {
        setIsOptionsOpen(!isOptionsOpen);
    };

    const { setShowLogin } = useAuthModal();
    const isLoggedIn = false; // Replace with actual auth check

    const handleProtectedAction = (action: () => void) => {
        if (!isLoggedIn) {
            setShowLogin(true);
            return;
        }
        action();
    };

    const toggleUpvote = () => {
        handleProtectedAction(() => {
            setIsUpvoted(!isUpvoted);
            if (isDownvoted) setIsDownvoted(false);
        });
    };

    const toggleDownvote = () => {
        handleProtectedAction(() => {
            setIsDownvoted(!isDownvoted);
            if (isUpvoted) setIsUpvoted(false);
        });
    };

    const handleJoinCommunity = () => {
        handleProtectedAction(() => {
            // Join community logic here
            console.log("Joining community");
        });
    };

    return (
        <div className="bg-white shadow text-black space-y-1">
            {/* Subreddit + time + join */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                    <img
                        src={
                            subredditIcon ??
                            "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png"
                        }
                        alt="subreddit avatar"
                        className="w-6 h-6 rounded-full"
                    />

                    <div
                        className="relative inline-block"
                        onMouseEnter={() => setIsHoveringCommunity(true)}
                        onMouseLeave={() => setIsHoveringCommunity(false)}
                    >
                        <Link
                            to={`/r/${subreddit}`}
                            className="font-semibold text-black hover:underline"
                        >
                            r/{subreddit}
                        </Link>

                        {isHoveringCommunity && (
                            <CommunityHoverCard communityId={communityId} />
                        )}
                    </div>

                    <span>•</span>
                    <span>{createdAt}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="text-white font-semibold text-xs hover:underline bg-blue-700 rounded-2xl p-1 px-3">
                        Join
                    </button>
                    <button
                        className="text-black font-semibold text-xl hover:underline"
                        onClick={toggleOptions}
                    >
                        ...
                    </button>
                </div>
            </div>

            {/* Options Modal */}
            {isOptionsOpen && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={toggleOptions} // Close options when clicking outside
                    ></div>
                    <div className="absolute bottom-0 left-0 w-full bg-white flex flex-col shadow-lg rounded-t-2xl  ">
                        <div className="flex justify-between items-center p-4 border-b">
                            <span className="font-bold p-2">Options</span>
                            <button
                                onClick={toggleOptions}
                                className="text-gray-600"
                            >
                                <img
                                    src={CloseIcon}
                                    alt="Close"
                                    className="w-4 h-4"
                                />
                            </button>
                        </div>
                        <div className="p-4 text-sm ">
                            <div className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded ">
                                <img
                                    src={SaveIcon}
                                    alt="Save"
                                    className="w-5 h-5"
                                />
                                <span>Save</span>
                            </div>
                            <div className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                                <img
                                    src={HideIcon}
                                    alt="Hide"
                                    className="w-5 h-5"
                                />
                                <span>Hide</span>
                            </div>
                            <div className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                                <img
                                    src={ReportIcon}
                                    alt="Report"
                                    className="w-5 h-5"
                                />
                                <span>Report</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

            {/* Body text */}
            {body && <p className="text-sm text-gray-800 ">{body}</p>}

            {/* Image */}
            {imageUrl && (
                <img
                    src={`http://localhost:5000${imageUrl}`}
                    alt="Post visual"
                    className="w-full max-h-[512px] object-cover rounded-2xl"
                    onClick={handleImageClick}
                />
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed bg-black inset-0 bg-opacity-75 flex justify-center items-center z-50">
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-white text-2xl z-50 rounded-full p-2"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Inline style for background opacity
                    >
                        <img
                            src={CloseIcon}
                            alt="Close"
                            className="w-6 h-6"
                            style={{ filter: "invert(1)" }}
                        />
                    </button>
                    <div className="relative">
                        <img
                            src={imageUrl}
                            alt="Post visual"
                            className="max-w-full max-h-full"
                        />
                    </div>
                </div>
            )}

            {/* Action bar */}
            <div className="flex items-center text-sm text-black text-semibold space-x-5 py-2">
                <div
                    className={`flex items-center space-x-1 p-1 rounded-full ${
                        isUpvoted || isDownvoted
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-black"
                    }`}
                >
                    <div onClick={toggleUpvote} className="cursor-pointer">
                        <img
                            src={UpvoteIcon}
                            alt="Upvote"
                            className="w-5 h-5"
                            style={{ color: isUpvoted ? "white" : "black" }}
                        />
                    </div>
                    <span>{score}</span>
                    <div onClick={toggleDownvote} className="cursor-pointer">
                        <img
                            src={DownvoteIcon}
                            alt="Downvote"
                            className="w-5 h-5"
                            style={{ color: isDownvoted ? "white" : "black" }}
                        />
                    </div>
                </div>
                <Link
                    to={`/post/${id}`}
                    className="flex items-center space-x-1 bg-gray-200 p-1 rounded-full hover:bg-gray-300"
                >
                    <img src={CommentIcon} alt="Comment" className="w-5 h-5" />
                    <span>{comments}</span>
                </Link>
                <div className="flex items-center space-x-1 bg-gray-200 p-1 rounded-full">
                    <img src={AwardIcon} alt="Award" className="w-5 h-5" />
                    <span>6</span>
                </div>
                <div
                    className="flex items-center space-x-1 bg-gray-200 p-1 rounded-full cursor-pointer"
                    onClick={() => {
                        // Handle share functionality
                        console.log("Share clicked");
                    }}
                >
                    <img src={ShareIcon} alt="Share" className="w-5 h-5" />
                    <span>Share</span>
                </div>
            </div>
        </div>
    );
}
