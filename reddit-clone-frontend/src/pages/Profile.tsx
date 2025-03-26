import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User } from "../types/User";
import { auth } from "../services/api";
import plusIcon from "../assets/plus-icon.svg";

export default function Profile() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");
    const tabs = ["Overview", "Posts", "Comments", "Saved", "Hidden", "Upvoted", "Downvoted"];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await auth.getCurrentUser();
                const user = userData.data;
                console.log("User data:", user);
                
                setUser(user);
            } catch (error) {
                console.error("Error loading user data:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="w-screen overflow-hidden">
            <div className="bg-blue-500 h-32 w-full rounded-t-lg relative ">
                <div className="absolute inset-x-0 -bottom-16  flex justify-start">
                    <div className="bg-gray-300 rounded-full h-24 w-24 border-4  border-white"></div>
                </div>
            </div>
            <div className="text-start mt-20 ml-5">
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p className="text-gray-600">u/{user.username}</p>
            </div>
            <div className="mt-4 px-4">
                <details className="group cursor-pointer">
                    <summary className="text-gray-800 font-semibold">About</summary>
                    <div className="pl-4 text-gray-600">This is the about section. Content to be added later.</div>
                </details>
            </div>
            <div className="flex justify-center mt-4  overflow-x-scroll no-scrollbar px-4 ">
    <div className="flex space-x-4">
        {tabs.map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm font-semibold whitespace-nowrap ${
                    activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
            >
                {tab}
            </button>
        ))}
    </div>
</div>

            <div className="mt-4 px-4 flex justify-between items-center">
    <button className="flex items-center space-x-2 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100">
        <img src={plusIcon} alt="create icon" />
        <span>Create Post</span>
    </button>
    <div className="text-gray-500">New ▼</div>
</div>
            <div className="mt-4 px-4 pb-4">
                <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                    <p className="text-gray-700">Post content will render here...</p>
                </div>
            </div>
        </div>
    );
}
