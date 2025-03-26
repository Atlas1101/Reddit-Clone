import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function AvatarDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useUser();
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        // Here you can add functionality to actually toggle dark mode in your app.
    };

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-full">
                <img
                src="https://dummyimage.com/40x40/ccc/000&text=👤"
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
            />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-200 text-gray-800 z-50">
                    <div className="p-3 border-b">
                        <Link to={`/user/${user?.username}`} className="block text-sm font-semibold hover:bg-gray-100 p-2 rounded">
                            View Profile
                            <p className="text-xs text-gray-500">u/{user?.username}</p>
                        </Link>
                    </div>

                    <div className="p-3 border-b">
                        <button 
                            onClick={toggleDarkMode}
                            className="flex justify-between w-full text-sm font-semibold hover:bg-gray-100 p-2 rounded"
                        >
                            Dark Mode
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={toggleDarkMode}
                                className="ml-2 w-5 h-5"
                            />
                        </button>
                    </div>

                    <div className="p-3 border-b">
                        <Link to="/settings" className="block text-sm font-semibold hover:bg-gray-100 p-2 rounded">
                            Settings
                        </Link>
                    </div>

                    <div className="p-3">
                        <button 
                            onClick={logout} 
                            className="block w-full text-sm font-semibold text-left hover:bg-gray-100 p-2 rounded"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
