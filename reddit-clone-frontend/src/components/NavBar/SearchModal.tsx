import React, { useState } from "react";
import { Link } from "react-router-dom";
import backIcon from "../../assets/back-icon.svg";
import SearchIcon from "../../assets/search-icon.svg";
import { Post } from "../../types/Post";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    posts: Post[];
}

export default function SearchModal({
    isOpen,
    onClose,
    posts,
}: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState("");

    if (!isOpen) return null;

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-100 bg-opacity-50">
            <div className="relative w-full max-w-lg mx-auto bg-white p-4 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b pb-3 mb-3">
                    <h2 className="text-lg font-semibold">Search Reddit</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <img src={backIcon} alt="Close" className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 shadow-md w-full mb-4">
                    <img src={SearchIcon} alt="Search" className="w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search Reddit"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-gray-700"
                    />
                </div>

                {searchQuery.trim() ? (
                    filteredPosts.length > 0 ? (
                        <div className="space-y-2">
                            {filteredPosts.map((post) => (
                                <Link
                                    key={post._id}
                                    to={`/post/${post._id}`}
                                    className="block p-3 rounded-lg border hover:bg-gray-100 transition"
                                    onClick={onClose} // close modal on selection
                                >
                                    <h3 className="font-semibold text-gray-800">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        r/{post.subreddit}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No results found.</p>
                    )
                ) : (
                    <div className="text-sm text-gray-400">
                        Start typing to search posts...
                    </div>
                )}
            </div>
        </div>
    );
}
