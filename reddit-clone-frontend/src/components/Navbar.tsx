import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthModal } from '../context/AuthModalContext';
import { useUser } from "../context/UserContext";
import Avatar from "./Avatar";
import SearchIcon from "../assets/search-icon.svg";
import backIcon from "../assets/back-icon.svg";

export default function Navbar() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const { setShowLogin } = useAuthModal();

    // Get user from context
    const { user, isLoading } = useUser();

    const handleCloseSidebar = () => {
        setAnimateOut(true);
        setTimeout(() => {
            setShowSidebar(false);
            setAnimateOut(false);
        }, 300); // matches CSS animation duration
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            console.log("Search:", searchQuery);
        }
    };

    return (
        <>
            <nav className="bg-white border-b p-3 flex items-center justify-between">
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

                {/* Search Bar */}
                <div className="flex-1 mx-4 hidden sm:block">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <img src={SearchIcon} alt="Search" className="w-5 h-5 text-gray-500" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search Reddit"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="block w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-700 placeholder-gray-500 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Mobile Search Icon */}
                <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-full sm:hidden"
                >
                    <img src={SearchIcon} alt="Search" className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-2">
                    <Link
                        to="/submit"
                        className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-200 transition"
                    >
                        <span className="text-2xl font-light">+</span>
                        <span className="text-sm font-medium hidden sm:block">Create</span>
                    </Link>

                    {/* Conditional Rendering: Log In button or Avatar */}
                    {!isLoading && (user ? (
                        <Avatar />
                    ) : (
                        <button 
                            onClick={() => setShowLogin(true)}
                            className="bg-orange-600 text-white text-sm rounded-full px-4 py-1 font-semibold hover:bg-orange-700"
                        >
                            Log In
                        </button>
                    ))}

                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-xl"
                    >
                        ⋯
                    </button>
                </div>
            </nav>

            {/* Mobile Full-Screen Search Modal */}
            {searchOpen && (
                <div className="fixed inset-0 bg-white z-50 p-4 flex items-center justify-center">
                    <div className="relative w-full max-w-lg mx-auto">
                        <button
                            onClick={() => setSearchOpen(false)}
                            className="absolute left-2 top-2 text-2xl"
                        >
                            <img src={backIcon} alt="Back" className="w-5 h-5" />
                        </button>
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 shadow-md w-full">
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
                    </div>
                </div>
            )}
        </>
    );
}
