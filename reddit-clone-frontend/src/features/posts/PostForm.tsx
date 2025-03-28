import { useState } from "react";
import { useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";

type PostType = "text" | "image" | "link" | "poll";

export default function PostForm() {
    const [postType, setPostType] = useState<PostType>("text");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [selectedSubreddit, setSelectedSubreddit] = useState<string | null>(
        null
    );
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setShowDropdown(false));

    const subreddits = [
        {
            name: "announcements",
            members: 305157802,
            icon: "https://styles.redditmedia.com/t5_2qh3s/styles/communityIcon_tijokm0tx3d41.png",
        },
        {
            name: "chessclub",
            members: 2558,
            icon: "https://styles.redditmedia.com/t5_2sjrp/styles/communityIcon_pfsgrrzpuyf41.png",
        },
        {
            name: "goodboomerhumor",
            members: 165440,
            icon: "https://styles.redditmedia.com/t5_4z6ft1/styles/communityIcon_u6li00gh0btb1.png",
        },
        // ...add more
    ];

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Create post</h1>
                <button className="text-sm text-blue-600 font-medium hover:underline">
                    Drafts
                </button>
            </div>

            {/* Subreddit selector */}
            <div className="relative mb-4">
                {/* <button
                    type="button"
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="flex items-center justify-between w-full border px-4 py-2 rounded text-sm hover:border-blue-500"
                >
                    <span className="flex items-center space-x-2">
                        <img
                            src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png"
                            className="w-5 h-5 rounded-full"
                        />
                        <span>
                            {selectedSubreddit
                                ? `r/${selectedSubreddit}`
                                : "Select a community"}
                        </span>
                    </span>
                    <span>⌄</span>
                </button> */}

                {/* Dropdown */}
                <div className="relative mb-4 w-80" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setShowDropdown((prev) => !prev)}
                        className="flex items-center justify-between w-full border rounded-full px-4 py-2 text-sm hover:border-blue-500"
                    >
                        <span className="flex items-center space-x-2">
                            <img
                                src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png"
                                className="w-5 h-5 rounded-full"
                            />
                            <span>
                                {selectedSubreddit
                                    ? `r/${selectedSubreddit}`
                                    : "Select a community"}
                            </span>
                        </span>
                        <span className="text-xs">⌄</span>
                    </button>

                    {showDropdown && (
                        <div className="absolute z-50 mt-2 w-full bg-white border rounded-2xl shadow-md max-h-96 overflow-y-auto">
                            {/* Search bar */}
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500 text-sm">
                                    🔍
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search communities"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-8 pr-3 py-2 text-sm border-b focus:outline-none rounded-t-2xl"
                                />
                            </div>

                            {/* Subreddit list */}
                            {subreddits
                                .filter((s) =>
                                    s.name
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase())
                                )
                                .map((s) => (
                                    <button
                                        key={s.name}
                                        onClick={() => {
                                            setSelectedSubreddit(s.name);
                                            setShowDropdown(false);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-3 text-sm"
                                    >
                                        <img
                                            src={s.icon}
                                            alt=""
                                            className="w-5 h-5 rounded-full"
                                        />
                                        <div>
                                            <div className="font-medium">
                                                r/{s.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {s.members.toLocaleString()}{" "}
                                                members
                                            </div>
                                        </div>
                                    </button>
                                ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-6 border-b text-sm mb-4">
                {["text", "image", "link", "poll"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setPostType(type as PostType)}
                        className={`py-2 capitalize border-b-2 ${
                            postType === type
                                ? "border-blue-600 text-black"
                                : "border-transparent text-gray-500"
                        }`}
                    >
                        {type === "image" ? "Images & Video" : type}
                    </button>
                ))}
            </div>

            {/* Post type-specific fields */}
            <form className="space-y-4">
                {/* Title */}
                <div>
                    <input
                        type="text"
                        maxLength={300}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title *"
                        className="w-full border rounded px-4 py-2 bg-gray-50 text-sm"
                        required
                    />
                    <div className="text-xs text-gray-500 text-right mt-1">
                        {title.length}/300
                    </div>
                </div>

                {/* Tags */}
                <input
                    type="text"
                    disabled
                    placeholder="Add tags"
                    className="w-full border rounded px-4 py-2 text-sm bg-gray-100 text-gray-400"
                />

                {postType === "text" && (
                    <textarea
                        rows={6}
                        placeholder="Body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full border rounded px-4 py-2 text-sm"
                    />
                )}

                {postType === "image" && (
                    <label
                        htmlFor="fileInput"
                        className="relative border border-dashed rounded h-40 flex items-center justify-center text-gray-400 text-sm cursor-pointer hover:bg-gray-50"
                    >
                        Drag and Drop or upload media
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) =>
                                setImage(e.target.files?.[0] || null)
                            }
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </label>
                )}

                {postType === "link" && (
                    <input
                        type="url"
                        placeholder="Link URL *"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="w-full border rounded px-4 py-2 bg-gray-50 text-sm"
                        required
                    />
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        disabled
                        className="bg-gray-100 text-gray-400 px-4 py-2 rounded text-sm"
                    >
                        Save Draft
                    </button>
                    <button
                        type="submit"
                        disabled={!title}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
}
