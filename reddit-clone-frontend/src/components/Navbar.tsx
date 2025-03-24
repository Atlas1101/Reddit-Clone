import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthModal } from '../context/AuthModalContext';

export default function Navbar() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { setShowLogin } = useAuthModal();

    const handleCloseSidebar = () => {
        setAnimateOut(true);
        setTimeout(() => {
            setShowSidebar(false);
            setAnimateOut(false);
        }, 300); // matches CSS animation duration
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            // route to search page or log
            console.log("Search:", searchQuery);
            // optionally: navigate(`/search?q=${searchQuery}`)
        }
    };

    return (
        <>
            <nav className="bg-white border-b p-3 flex items-center justify-between">
                {/* Left group: hamburger + reddit icon */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowSidebar(true)}
                        className="text-2xl"
                    >
                        ☰
                    </button>
                    <Link to="/" className="text-xl">
                        <img
                            src="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png"
                            alt="Reddit"
                            className="w-6 h-6"
                        />
                    </Link>
                </div>

                {/* Center: Search icon */}
                <div className="relative w-full max-w-xs">
                    <span className="absolute left-3 top-1.5 text-gray-500">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search Reddit"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full bg-gray-200 rounded-full pl-8 pr-4 py-1 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {/* Right: login + 3-dot menu */}
                <div className="flex items-center space-x-2">
                    <Link
                        to="/submit"
                        className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-200 transition"
                    >
                        <span className="text-xl font-light">＋</span>
                        <span className="text-sm font-medium">Create</span>
                    </Link>
                    <button 
                        onClick={() => setShowLogin(true)}
                        className="bg-orange-600 text-white text-sm rounded-full px-4 py-1 font-semibold hover:bg-orange-700"
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-xl"
                    >
                        ⋯
                    </button>
                </div>

                {/* Small dropdown menu */}
                {showMenu && (
                    <div className="absolute right-3 top-14 bg-white border rounded shadow p-2 text-sm z-10">
                        <button className="block w-full text-left px-2 py-1 hover:bg-gray-100">
                            Settings
                        </button>
                        <button className="block w-full text-left px-2 py-1 hover:bg-gray-100">
                            Help
                        </button>
                    </div>
                )}
            </nav>

            {/* Sidebar + Overlay */}
            {showSidebar && (
                <>
                    {/* Dimmed background */}
                    <div
                        className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40"
                        onClick={handleCloseSidebar}
                    ></div>

                    {/* Sidebar panel */}
                    <div
                        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-md z-50 p-4 overflow-y-auto ${
                            animateOut
                                ? "animate-slide-out"
                                : "animate-slide-in"
                        }`}
                    >
                        <button
                            onClick={handleCloseSidebar}
                            className="text-2xl mb-4"
                        >
                            ✕
                        </button>

                        {/* Sidebar content goes here */}
                        <div className="bg-gray-100 p-3 rounded mb-4 font-semibold flex items-center space-x-2">
                            <span>🚀</span>
                            <span>Popular</span>
                        </div>

                        {/* Topics */}
                        <div className="mb-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                                Topics
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex items-center justify-between">
                                    <span className="flex items-center space-x-2">
                                        <span>😄</span>
                                        <span>Internet Culture (Viral)</span>
                                    </span>
                                    <span>⌄</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="flex items-center space-x-2">
                                        <span>🎮</span>
                                        <span>Games</span>
                                    </span>
                                    <span>⌄</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="flex items-center space-x-2">
                                        <span>❓</span>
                                        <span>Q&As</span>
                                    </span>
                                    <span>⌄</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="flex items-center space-x-2">
                                        <span>💻</span>
                                        <span>Technology</span>
                                    </span>
                                    <span>⌄</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="flex items-center space-x-2">
                                        <span>🌟</span>
                                        <span>Pop Culture</span>
                                    </span>
                                    <span>⌄</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="flex items-center space-x-2">
                                        <span>🎬</span>
                                        <span>Movies & TV</span>
                                    </span>
                                    <span>⌄</span>
                                </li>
                            </ul>
                            <button className="mt-2 text-blue-600 text-sm hover:underline">
                                See more
                            </button>
                        </div>

                        {/* Resources */}
                        <div className="mt-6">
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                                Resources
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex items-center space-x-2">
                                    <span>🍵</span>
                                    <span>About Reddit</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span>📢</span>
                                    <span>Advertise</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span>📊</span>
                                    <span>
                                        Reddit Pro{" "}
                                        <span className="text-red-500 text-xs">
                                            BETA
                                        </span>
                                    </span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span>❓</span>
                                    <span>Help</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span>📖</span>
                                    <span>Blog</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
