import { useState, KeyboardEvent } from "react";
import SearchIcon from "../assets/search-icon.svg";
import backIcon from "../assets/back-icon.svg";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            console.log("Search:", searchQuery);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white z-50 p-4 flex flex-col items-center justify-start">
            <div className="relative w-full max-w-4xl mx-auto mt-4">
                <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 shadow-md w-full">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full"
                    >
                        <img src={backIcon} alt="Back" className="w-6 h-6" />
                    </button>
                    <input
                        type="text"
                        placeholder="Search Reddit"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full bg-transparent focus:outline-none text-gray-700 text-xl"
                    />
                    <img src={SearchIcon} alt="Search" className="w-6 h-6" />
                </div>
            </div>

            <div className="mt-6 w-full max-w-4xl mx-auto">
                <h3 className="text-gray-600 text-lg font-semibold mb-4">🔗 Trending Today</h3>
                <div className="space-y-2">
                    {[
                        "Tsukoda to replace Lawson",
                        "Waltz takes responsibility",
                        "New Avengers in production",
                        "No Man's Sky Relics trailer",
                        "Trump signs election order",
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition w-full"
                        >
                            <img
                                src={`https://via.placeholder.com/60`}
                                alt="Thumbnail"
                                className="w-12 h-12 rounded"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{item}</p>
                                <p className="text-gray-500 text-xs">
                                    r/{item.toLowerCase().replace(/ /g, "")} • 6h ago
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
