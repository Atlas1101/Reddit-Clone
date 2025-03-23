import { Link } from "react-router-dom";

import UpvoteIcon from "../assets/upvote-icon.svg";
import DownvoteIcon from "../assets/downvote-icon.svg";
import CommentIcon from "../assets/comment-icon.svg";
import ShareIcon from "../assets/share-icon.svg";
import AwardIcon from "../assets/award-icon.svg";
import CloseIcon from "../assets/close-icon.svg";
import { useState } from "react";

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
    subreddit = "exampleSub",
}: PostProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white shadow text-black space-y-1">
            {/* Subreddit + time + join */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                    <img
                        src={`https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png`}
                        alt="subreddit avatar"
                        className="w-6 h-6 rounded-full"
                    />
                    <Link
                        to={`/r/${subreddit}`}
                        className="font-semibold text-black hover:underline"
                    >
                        r/{subreddit}
                    </Link>
                    <span>•</span>
                    <span>{createdAt}</span>
                </div>
                <div className="flex items-center space-x-3">
                 <button className="text-white font-semibold text-xs hover:underline bg-blue-700 rounded-2xl p-1 px-3">
                    Join
                 </button>
                 <button className="text-black font-semibold text-xl hover:underline">
                    ...
                 </button>
                </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

            {/* Body text */}
            {body && <p className="text-sm text-gray-800 ">{body}</p>}

            {/* Image */}
            {imageUrl && (
                <img
                    src={imageUrl}
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
                            className="absolute top-2 right-2 text-white text-2xl z-100 bg-black rounded-full p-4 opacity-70 "
                        >
                            <img
                                src={CloseIcon}
                                alt="Close"
                                className="w-6 h-6"
                                style={{ filter: 'invert(1)' }} // This will make the icon white
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
                <div className="flex items-center space-x-1 bg-gray-200 p-1 rounded-full ">
                    <img src={UpvoteIcon} alt="Upvote" className="w-5 h-5" />
                    <span>{score}</span>
                    <div className="flex items-center space-x-1">
                    <img src={DownvoteIcon} alt="Downvote" className="w-5 h-5" />
                </div>
                </div>
                <div className="flex items-center space-x-1 bg-gray-200 p-1 rounded-full">
                <img src={CommentIcon} alt="Comment" className="w-5 h-5" />
                    <span>{comments}</span>
                </div>
                <div className="flex items-center space-x-1 bg-gray-200 p-1 rounded-full">
                <img src={AwardIcon} alt="Award" className="w-5 h-5" />
                    <span>6</span>
                </div>
                <div className="flex items-center space-x-1 bg-gray-200 p-1 rounded-full">
                <img src={ShareIcon} alt="Share" className="w-5 h-5" />
                    <span>Share</span>
                </div>
            </div>
        </div>
    );
}
