import React, { useState } from "react";
import backIcon from "../assets/back-icon.svg";
import SearchIcon from "../assets/search-icon.svg";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState("");

    if (!isOpen) return null;

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            console.log("Search:", searchQuery);
            onClose(); // Close the modal after searching
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-100 bg-opacity-50">
            <div className="relative w-full max-w-lg mx-auto bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center justify-between border-b pb-3 mb-3">
                    <h2 className="text-lg font-semibold">Search Reddit</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <img src={backIcon} alt="Close" className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 shadow-md w-full max-w-md mx-auto">
                    <img src={SearchIcon} alt="Search" className="w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search Reddit"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full bg-transparent focus:outline-none text-gray-700"
                    />
                </div>
                <div className="mt-4">
                    <h3 className="text-gray-600 text-sm font-semibold mb-2">🔗 Trending Today</h3>
                    <div className="space-y-2">
                        {["Tsukoda to replace Lawson", "Waltz takes responsibility", "New Avengers in production", "No Man's Sky Relics trailer", "Trump signs election order"].map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 bg-gray-50 p-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
                                <img 
                                    src={`https://via.placeholder.com/60`} 
                                    alt="Thumbnail" 
                                    className="w-12 h-12 rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{item}</p>
                                    <p className="text-gray-500 text-xs">r/{item.toLowerCase().replace(/ /g, "")} • 6h ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
