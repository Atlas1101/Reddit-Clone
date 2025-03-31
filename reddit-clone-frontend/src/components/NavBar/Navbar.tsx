<<<<<<< HEAD
import { Link } from "react-router-dom";
import { useState } from "react";
=======
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useEffect, useState, useRef } from "react"; // Import useRef
import { useAuthModal } from "../../context/AuthModalContext";
>>>>>>> da468ffa8b3dd9802e4b12635f07421943295192
import { useUser } from "../../context/UserContext";
import Avatar from "./Avatar";
import SidebarComponent from "./Sidebar";
import SearchIcon from "../../assets/search-icon.svg";
<<<<<<< HEAD
import backIcon from "../../assets/back-icon.svg";
import Login from "./Login";
import Register from "./Register";
import { motion, AnimatePresence } from "framer-motion";
=======
import backIcon from "../../assets/back-icon.svg"; // Keep if Sidebar uses it
import SearchModal from "./SearchModal"; // Keep for mobile
import { api } from "../../services/api";
import { Post } from "../../types/Post";

interface SidebarProps {
    onClose: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
    return (
        <div>
            {/* Sidebar content */}
            <button onClick={onClose} aria-label="Close Sidebar">
                Close
            </button>
        </div>
    );
}
>>>>>>> da468ffa8b3dd9802e4b12635f07421943295192

export default function Navbar() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);
<<<<<<< HEAD
    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);

=======

    // State for Desktop Search Dropdown
    const [searchQuery, setSearchQuery] = useState(""); // Query for desktop input
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); // Filtered results for dropdown
    const [showResults, setShowResults] = useState(false); // Visibility of dropdown

    // State for Mobile Search Modal
    const [searchOpen, setSearchOpen] = useState(false); // Visibility of modal

    const [allPosts, setAllPosts] = useState<Post[]>([]); // Holds all fetched posts
    const { setShowLogin } = useAuthModal();
>>>>>>> da468ffa8b3dd9802e4b12635f07421943295192
    const { user, isLoading } = useUser();
    const navigate = useNavigate(); // Hook for navigation
    const searchContainerRef = useRef<HTMLDivElement>(null); // Ref for click-outside detection

    // Fetch all posts on mount
    useEffect(() => {
        api.get("/posts")
            .then((res) => {
                console.log("Fetched posts:", res.data);
                setAllPosts(res.data);
            })
            .catch((err) => console.error("Failed to load posts", err));
    }, []);

    // Filter posts based on desktop search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredPosts([]);
            // Don't necessarily hide results here, let focus/blur/click handle it
            // setShowResults(false);
            return;
        }

        const lowerCaseQuery = searchQuery.toLowerCase();
        const results = allPosts.filter((post) =>
            post.title.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredPosts(results);
        setShowResults(true); // Show results when there's a query and filtering is done
    }, [searchQuery, allPosts]); // Re-run when query or the list of all posts changes

    // Handle clicks outside the search input and results dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setShowResults(false); // Hide results if click is outside
            }
        }
        // Add listener when component mounts
        document.addEventListener("mousedown", handleClickOutside);
        // Clean up listener when component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); // Empty dependency array means this effect runs only once

    const handleCloseSidebar = () => {
        setAnimateOut(true);
        setTimeout(() => {
            setShowSidebar(false);
            setAnimateOut(false);
        }, 300);
    };

    // Handle clicking a result in the dropdown
    const handleResultClick = (postId: string) => {
        navigate(`/post/${postId}`); // Navigate to the post page
        setShowResults(false); // Hide the results dropdown
        setSearchQuery(""); // Optional: Clear the search bar after selection
    };

    return (
        <>
            <nav className="bg-white border-b p-3 flex items-center justify-between relative z-30">
                {" "}
                {/* Add z-index if needed */}
                <div className="flex items-center space-x-3">
<<<<<<< HEAD
                    <button onClick={() => setShowSidebar(true)} className="text-2xl">
=======
                    {/* Sidebar Toggle */}
                    <button
                        onClick={() => setShowSidebar(true)}
                        className="text-2xl"
                        aria-label="Open menu"
                    >
>>>>>>> da468ffa8b3dd9802e4b12635f07421943295192
                        ☰
                    </button>
                    {/* Logo */}
                    <Link to="/" className="text-xl">
                        <img
                            src="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png"
                            alt="Reddit"
                            className="w-6 h-6"
                        />
                    </Link>
                </div>
<<<<<<< HEAD

                <div className="flex-1 mx-4 hidden sm:block">
=======
                {/* --- Desktop Search Bar & Results --- */}
                <div
                    className="flex-1 mx-4 hidden sm:block relative"
                    ref={searchContainerRef} // Attach ref here
                >
>>>>>>> da468ffa8b3dd9802e4b12635f07421943295192
                    <div className="relative">
                        {" "}
                        {/* Container for input and icon */}
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <img
                                src={SearchIcon}
                                alt="" // Decorative icon
                                className="w-5 h-5 text-gray-500"
                            />
                        </span>
                        <input
                            type="text"
                            placeholder="Search Reddit"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => {
                                // Show results on focus only if there's already text and results exist
                                if (
                                    searchQuery.trim() &&
                                    filteredPosts.length > 0
                                ) {
                                    setShowResults(true);
                                }
                            }}
                            // Removed onKeyDown - no longer needed for 'Enter'
                            className="block w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-700 placeholder-gray-500 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Search Reddit"
                        />
                    </div>

                    {/* Desktop Search Results Dropdown */}
                    {showResults && filteredPosts.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-40 max-h-80 overflow-y-auto">
                            {" "}
                            {/* Ensure z-index is high enough */}
                            <ul>
                                {" "}
                                {/* Use a list for semantics */}
                                {filteredPosts.map((post) => (
                                    <li
                                        key={post._id}
                                        // Use onMouseDown to potentially capture click before blur hides the dropdown
                                        onMouseDown={() =>
                                            handleResultClick(post._id)
                                        }
                                        className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                    >
                                        <div className="font-medium text-sm text-gray-800">
                                            {post.title}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            r/{post.subreddit}
                                        </div>
                                        {/* Add more details if needed, like user, score etc. */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Optional: Show "No results" directly in dropdown */}
                    {showResults &&
                        searchQuery.trim() &&
                        filteredPosts.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-40 p-3 text-sm text-gray-500">
                                No results found for "{searchQuery}"
                            </div>
                        )}
                </div>
<<<<<<< HEAD

=======
                {/* --- End Desktop Search --- */}
                {/* --- Mobile Search Icon --- */}
>>>>>>> da468ffa8b3dd9802e4b12635f07421943295192
                <button
                    onClick={() => setSearchOpen(true)} // Opens the modal
                    className="p-2 hover:bg-gray-100 rounded-full sm:hidden"
                    aria-label="Search"
                >
                    <img src={SearchIcon} alt="" className="w-5 h-5" />
                </button>
                {/* --- End Mobile Search --- */}
                <div className="flex items-center space-x-2">
                    {/* Create Button */}
                    <Link
                        to="/submit"
                        className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-200 transition"
                    >
                        <span className="text-2xl font-light">+</span>
                        <span className="text-sm font-medium hidden sm:block">
                            Create
                        </span>
                    </Link>

<<<<<<< HEAD
                    {!isLoading && (user ? (
                        <Avatar />
                    ) : (
                        <button
                            onClick={() => setAuthMode("login")}
                            className="bg-orange-600 text-white text-sm rounded-full px-4 py-1 font-semibold hover:bg-orange-700"
                        >
                            Log In
                        </button>
                    ))}
=======
                    {/* Auth Buttons/Avatar */}
                    {!isLoading &&
                        (user ? (
                            <Avatar />
                        ) : (
                            <button
                                onClick={() => setShowLogin(true)}
                                className="bg-orange-600 text-white text-sm rounded-full px-4 py-1 font-semibold hover:bg-orange-700"
                            >
                                Log In
                            </button>
                        ))}
>>>>>>> da468ffa8b3dd9802e4b12635f07421943295192

                    {/* Optional Menu Button */}
                    {/* <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-xl"
                        aria-label="More options"
                    >
                        ⋯
                    </button> */}
                </div>
            </nav>

<<<<<<< HEAD
            {showSidebar && (
                <div
                    className={`fixed inset-0 z-50 transition-opacity ${animateOut ? 'opacity-0' : 'opacity-100'}`}
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onClick={handleCloseSidebar}
                />
            )}

=======
            {/* Sidebar Overlay & Component (Keep as is) */}
            {showSidebar && (
                <div
                    className={`fixed inset-0 z-40 transition-opacity ${
                        // Adjust z-index if needed
                        animateOut ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    onClick={handleCloseSidebar}
                    aria-hidden="true"
                />
            )}
>>>>>>> da468ffa8b3dd9802e4b12635f07421943295192
            {showSidebar && (
                <div
                    className={`fixed left-0 top-0 bottom-0 w-64 bg-white z-50 transition-transform transform ${
                        // Adjust z-index if needed
                        animateOut ? "-translate-x-full" : "translate-x-0"
                    }`}
                >
                    <SidebarComponent onClose={handleCloseSidebar} />{" "}
                    {/* Assuming Sidebar has an onClose prop */}
                </div>
            )}

<<<<<<< HEAD
            {searchOpen && (
                <div className="fixed inset-0 bg-white z-50 p-4 flex items-start justify-center">
                    <div className="relative w-full max-w-lg mx-auto">
                        <button
                            onClick={() => setSearchOpen(false)}
                            className="absolute left-2 top-2 text-2xl"
                        >
                            <img src={backIcon} alt="Back" className="w-5 h-5 fixed left-2" />
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

            <AnimatePresence>
                {authMode && (
                    <motion.div
                        key={authMode}
                        initial={{ x: authMode === "register" ? 500 : 0, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: authMode === "login" ? -500 : 500, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
                    >
                        <div className="relative w-full max-w-md">
                            {authMode === "login" ? (
                                <Login
                                    onSwitch={() => setAuthMode("register")}
                                    onClose={() => setAuthMode(null)}
                                />
                            ) : (
                                <Register
                                    onSwitch={() => setAuthMode("login")}
                                    onClose={() => setAuthMode(null)}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
=======
            {/* Search Modal (for mobile - keep as is) */}
            <SearchModal
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
                posts={allPosts} // Pass all posts to the modal as well
            />
>>>>>>> da468ffa8b3dd9802e4b12635f07421943295192
        </>
    );
}