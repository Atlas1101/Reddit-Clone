import { Link } from "react-router-dom";

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
    return (
        <div className="bg-white rounded-md shadow border p-4 text-black space-y-3">
            {/* Subreddit + time + join */}
            <div className="flex items-center justify-between text-sm text-gray-500">
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
                <button className="text-blue-600 font-semibold text-sm hover:underline">
                    Join
                </button>
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold">{title}</h2>

            {/* Body text */}
            {body && <p className="text-sm text-gray-700">{body}</p>}

            {/* Image */}
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Post visual"
                    className="w-full max-h-[512px] object-cover rounded"
                />
            )}

            {/* Action bar */}
            <div className="flex items-center text-sm text-gray-500 space-x-6 pt-2">
                <div className="flex items-center space-x-1">
                    <span>⬆️</span>
                    <span>{score}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>{comments} Comments</span>
                </div>
                <div className="flex items-center space-x-1">
                    <span>🏆</span>
                    <span>6</span>
                </div>
                <div className="flex items-center space-x-1">
                    <span>🔗</span>
                    <span>Share</span>
                </div>
            </div>
        </div>
    );
}
