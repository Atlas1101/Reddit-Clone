import { Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import Avatar from "./Avatar";
import Sidebar from "./Sidebar";
import SearchIcon from "../../assets/search-icon.svg";
import backIcon from "../../assets/back-icon.svg";
import Login from "./Login";
import Register from "./Register";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);

    const { user, isLoading } = useUser();

    const handleCloseSidebar = () => {
        setAnimateOut(true);
        setTimeout(() => {
            setShowSidebar(false);
            setAnimateOut(false);
        }, 300);
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
                    <button onClick={() => setShowSidebar(true)} className="text-2xl">
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

                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-xl"
                    >
                        ⋯
                    </button>
                </div>
            </nav>

            {showSidebar && (
                <div
                    className={`fixed inset-0 z-50 transition-opacity ${animateOut ? 'opacity-0' : 'opacity-100'}`}
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onClick={handleCloseSidebar}
                />
            )}

            {showSidebar && (
                <div className={`fixed left-0 top-0 bottom-0 z-50 transition-transform ${animateOut ? '-translate-x-full' : 'translate-x-0'}`}>
                    <Sidebar />
                </div>
            )}

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
        </>
    );
}