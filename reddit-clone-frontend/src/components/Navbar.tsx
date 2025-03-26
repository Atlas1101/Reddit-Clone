import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthModal } from '../context/AuthModalContext';
import { useUser } from "../context/UserContext";
import Avatar from "./Avatar";
import SearchModal from "./SearchModal";

import SearchIcon from "../assets/search-icon.svg";

export default function Navbar() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
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

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <img src={SearchIcon} alt="Search" className="w-5 h-5" />
                    </button>

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

            {/* Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
