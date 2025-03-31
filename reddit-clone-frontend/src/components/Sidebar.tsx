import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { Star } from 'lucide-react'; // Keep if you plan to use it

// Interface for the Community data structure
interface Community {
    id: string; // Assuming ID is a string, adjust if needed
    name: string;
    icon: string;
}

// --- Define Props Interface ---
// This tells TypeScript what props the Sidebar component expects
interface SidebarProps {
    onClose: () => void; // Expects a function that takes no arguments and returns void
}

// --- Use React.FC with the Props Interface ---
const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
    // State for fetched data
    const [communities, setCommunities] = useState<Community[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Added loading state
    const [error, setError] = useState<string | null>(null); // Added error state

    // State for collapsible sections
    const [showFeeds, setShowFeeds] = useState(false);
    const [showCommunities, setShowCommunities] = useState(true);
    const [showResources, setShowResources] = useState(true);

    // Fetch communities on component mount
    useEffect(() => {
        setIsLoading(true); // Start loading
        setError(null); // Reset error state
        fetch("/api/communities") // Make sure this endpoint exists and returns Community[]
            .then((res) => {
                if (!res.ok) {
                    // Handle HTTP errors (like 404, 500)
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data: Community[]) => {
                // Assuming the API returns the correct type
                setCommunities(data);
                setIsLoading(false); // Stop loading on success
            })
            .catch((err) => {
                console.error("Failed to fetch communities:", err);
                setError("Failed to load communities."); // Set error message
                setIsLoading(false); // Stop loading on error
            });
    }, []); // Empty dependency array ensures this runs only once on mount

    // Helper function to render community list content
    const renderCommunityList = () => {
        if (isLoading) {
            return (
                <div className="p-2 text-gray-500">Loading communities...</div>
            );
        }
        if (error) {
            return <div className="p-2 text-red-600">{error}</div>;
        }
        if (communities.length === 0) {
            return (
                <div className="p-2 text-gray-500">No communities found.</div>
            );
        }
        return (
            <>
                {communities.map((community) => (
                    <div
                        key={community.id}
                        className="p-2 flex items-center space-x-2 hover:bg-gray-100 rounded"
                    >
                        <img
                            src={
                                community.icon || "/default-community-icon.png"
                            } // Provide a fallback icon
                            alt={`${community.name} icon`} // Add meaningful alt text
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0" // Added object-cover
                        />
                        {/* Make the whole item clickable, not just the text */}
                        <Link
                            to={`/r/${community.name}`}
                            className="flex-1 truncate"
                            onClick={onClose}
                            title={`r/${community.name}`}
                        >
                            r/{community.name}
                        </Link>
                        {/* <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500 cursor-pointer" /> */}
                    </div>
                ))}
            </>
        );
    };

    return (
        // Added overflow-y-auto for scrolling if content exceeds height
        <div className="w-64 h-full bg-white text-black fixed border-r border-gray-200 flex flex-col overflow-y-auto">
            {/* Header Section with Close Button */}
            <div className="p-4 flex items-center justify-between border-b">
                <Link
                    to="/"
                    onClick={onClose}
                    className="flex items-center space-x-2 hover:opacity-80"
                    title="Home"
                >
                    <span className="text-xl">🏠</span>
                    <span className="font-semibold">Home</span>
                </Link>
                {/* --- Close Button --- */}
                <button
                    onClick={onClose} // Use the onClose prop passed from Navbar
                    className="text-gray-500 hover:text-gray-900 text-2xl p-1 rounded-full hover:bg-gray-200"
                    aria-label="Close menu"
                >
                    &times; {/* Simple 'X' icon */}
                </button>
            </div>
            {/* Main Navigation */}
            <nav className="flex-grow">
                {" "}
                {/* Added flex-grow to push resources down */}
                <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-100 rounded mx-2">
                        <Link to="/popular" onClick={onClose}>
                            🔥 Popular
                        </Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 rounded mx-2">
                        <Link to="/explore" onClick={onClose}>
                            🔍 Explore
                        </Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 rounded mx-2">
                        <Link to="/all" onClick={onClose}>
                            📊 All
                        </Link>
                    </li>
                </ul>
                <hr className="my-2" />
                {/* Custom Feeds Section */}
                <div
                    className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-100 rounded mx-2"
                    onClick={() => setShowFeeds(!showFeeds)}
                    aria-expanded={showFeeds}
                    aria-controls="custom-feeds-content"
                >
                    <span className="text-sm font-medium text-gray-600 uppercase">
                        Custom Feeds
                    </span>
                    <span>{showFeeds ? "▲" : "▼"}</span>
                </div>
                {showFeeds && (
                    <div id="custom-feeds-content" className="pl-6 pr-2 pb-2">
                        {/* Make actionable items buttons or links */}
                        <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-700">
                            ➕ Create a custom feed
                        </button>
                    </div>
                )}
                <hr className="my-2" />
                {/* Communities Section */}
                <div
                    className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-100 rounded mx-2"
                    onClick={() => setShowCommunities(!showCommunities)}
                    aria-expanded={showCommunities}
                    aria-controls="communities-content"
                >
                    <span className="text-sm font-medium text-gray-600 uppercase">
                        Communities
                    </span>
                    <span>{showCommunities ? "▲" : "▼"}</span>
                </div>
                {showCommunities && (
                    <div
                        id="communities-content"
                        className="pl-6 pr-2 pb-2 text-sm"
                    >
                        <button className="w-full text-left px-2 py-1 mb-1 hover:bg-gray-100 rounded text-gray-700">
                            ➕ Create a community
                        </button>
                        {/* Render loading/error/data */}
                        {renderCommunityList()}
                    </div>
                )}
            </nav>{" "}
            {/* End Main Navigation (flex-grow) */}
            {/* Resources Section (Pushed towards bottom) */}
            <div className="mt-auto border-t">
                {" "}
                {/* Use mt-auto to push to bottom */}
                <hr className="my-2" />
                <div
                    className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-100 rounded mx-2"
                    onClick={() => setShowResources(!showResources)}
                    aria-expanded={showResources}
                    aria-controls="resources-content"
                >
                    <span className="text-sm font-medium text-gray-600 uppercase">
                        Resources
                    </span>
                    <span>{showResources ? "▲" : "▼"}</span>
                </div>
                {showResources && (
                    <div
                        id="resources-content"
                        className="pl-6 pr-2 pb-4 text-sm"
                    >
                        {/* Use <a> tags for external links */}
                        <a
                            href="https://www.redditinc.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-2 py-1 hover:bg-gray-100 rounded text-gray-700"
                        >
                            About Reddit
                        </a>
                        <a
                            href="https://support.reddithelp.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-2 py-1 hover:bg-gray-100 rounded text-gray-700"
                        >
                            Help
                        </a>
                        <a
                            href="https://redditblog.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-2 py-1 hover:bg-gray-100 rounded text-gray-700"
                        >
                            Blog
                        </a>
                        <a
                            href="https://www.redditinc.com/careers"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-2 py-1 hover:bg-gray-100 rounded text-gray-700"
                        >
                            Careers
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// // import { Star } from 'lucide-react';

// interface Community {
//   id: string;
//   name: string;
//   icon: string;
// }

// const Sidebar: React.FC = () => {
//   const [communities, setCommunities] = useState<Community[]>([]);
//   const [showFeeds, setShowFeeds] = useState(false);
//   const [showCommunities, setShowCommunities] = useState(true);
//   const [showResources, setShowResources] = useState(true);

//   useEffect(() => {
//     fetch('/api/communities')
//       .then((res) => res.json())
//       .then((data) => setCommunities(data));
//   }, []);

//   return (
//     <div className="w-64 h-full bg-white text-black fixed border-r border-gray-200">
//       <div className="p-4 text-lg font-semibold flex items-center space-x-2">
//         <Link to="/" className="flex items-center space-x-2">
//           <span>🏠</span>
//           <span>Home</span>
//         </Link>
//       </div>
//       <ul>
//         <li className="p-4 hover:bg-gray-100">
//           <Link to="/popular">🔥 Popular</Link>
//         </li>
//         <li className="p-4 hover:bg-gray-100">
//           <Link to="/explore">🔍 Explore</Link>
//         </li>
//         <li className="p-4 hover:bg-gray-100">
//           <Link to="/all">📊 All</Link>
//         </li>
//       </ul>

//       <hr className="my-2" />
//       <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setShowFeeds(!showFeeds)}>
//         <span>Custom Feeds</span>
//         <span>{showFeeds ? '▲' : '▼'}</span>
//       </div>
//       {showFeeds && (
//         <div className="pl-6">
//           <div className="p-2 hover:bg-gray-100">➕ Create a custom feed</div>
//         </div>
//       )}

//       <hr className="my-2" />
//       <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setShowCommunities(!showCommunities)}>
//         <span>Communities</span>
//         <span>{showCommunities ? '▲' : '▼'}</span>
//       </div>
//       {showCommunities && (
//         <div className="pl-6">
//           <div className="p-2 hover:bg-gray-100">➕ Create a community</div>
//           {communities.map((community) => (
//             <div key={community.id} className="p-2 flex items-center space-x-2 hover:bg-gray-100">
//               <img src={community.icon} alt="" className="w-6 h-6 rounded-full" />
//               <Link to={`/r/${community.name}`} className="flex-1">r/{community.name}</Link>
//               {/* <Star className="w-4 h-4" /> */}
//             </div>
//           ))}
//         </div>
//       )}

//       <hr className="my-2" />
//       <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setShowResources(!showResources)}>
//         <span>Resources</span>
//         <span>{showResources ? '▲' : '▼'}</span>
//       </div>
//       {showResources && (
//         <div className="pl-6">
//           <div className="p-2 hover:bg-gray-100">
//             <Link to="https://www.redditinc.com">About Reddit</Link>
//           </div>
//           <div className="p-2 hover:bg-gray-100">
//             <Link to="https://support.reddithelp.com">Help</Link>
//           </div>
//           <div className="p-2 hover:bg-gray-100">
//             <Link to="https://redditblog.com">Blog</Link>
//           </div>
//           <div className="p-2 hover:bg-gray-100">
//             <Link to="https://www.redditinc.com/careers">Careers</Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;
