import { useEffect, useState } from "react";

type CommunityHoverCardProps = {
    communityId: string;
    position?: "top" | "bottom";
};

type CommunityData = {
    name: string;
    description?: string;
    icon?: string;
    bannerImage?: string;
    memberCount?: number;
    onlineCount?: number;
};

export default function CommunityHoverCard({
    communityId,
    position = "bottom",
}: CommunityHoverCardProps) {
    const [community, setCommunity] = useState<CommunityData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/api/communities/${communityId}`)
            .then((res) => res.json())
            .then((data) => {
                setCommunity(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [communityId]);

    if (loading || !community) return null;

    return (
        <div
            className={`absolute z-50 shadow-lg rounded-lg bg-white border w-80 text-sm p-4 ${
                position === "top" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
        >
            {community.bannerImage && (
                <img
                    src={community.bannerImage}
                    alt="Banner"
                    className="w-full h-20 object-cover rounded-t"
                />
            )}

            <div className="flex items-center space-x-3 mt-2">
                <img
                    src={
                        community.icon ??
                        "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png"
                    }
                    alt="Community Icon"
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <p className="font-semibold">r/{community.name}</p>
                    {community.description && (
                        <p className="text-gray-500 text-xs truncate">
                            {community.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-3 text-xs text-gray-600">
                <div>
                    <span className="font-bold">
                        {community.memberCount ?? 1}
                    </span>{" "}
                    Members
                </div>
                <div>
                    <span className="text-green-600 font-bold">
                        {community.onlineCount ?? 1}
                    </span>{" "}
                    Online
                </div>
            </div>

            <button className="w-full mt-3 text-xs bg-blue-600 text-white py-1 rounded-full hover:bg-blue-700">
                Join
            </button>
        </div>
    );
}
