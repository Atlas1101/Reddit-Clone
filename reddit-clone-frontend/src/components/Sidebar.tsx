import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { Star } from 'lucide-react';

interface Community {
  id: string;
  name: string;
  icon: string;
}

const Sidebar: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [showFeeds, setShowFeeds] = useState(false);
  const [showCommunities, setShowCommunities] = useState(true);
  const [showResources, setShowResources] = useState(true);

  useEffect(() => {
    fetch('/api/communities')
      .then((res) => res.json())
      .then((data) => setCommunities(data));
  }, []);

  return (
    <div className="w-64 h-full bg-white text-black fixed border-r border-gray-200">
      <div className="p-4 text-lg font-semibold flex items-center space-x-2">
        <Link to="/" className="flex items-center space-x-2">
          <span>🏠</span>
          <span>Home</span>
        </Link>
      </div>
      <ul>
        <li className="p-4 hover:bg-gray-100">
          <Link to="/popular">🔥 Popular</Link>
        </li>
        <li className="p-4 hover:bg-gray-100">
          <Link to="/explore">🔍 Explore</Link>
        </li>
        <li className="p-4 hover:bg-gray-100">
          <Link to="/all">📊 All</Link>
        </li>
      </ul>

      <hr className="my-2" />
      <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setShowFeeds(!showFeeds)}>
        <span>Custom Feeds</span>
        <span>{showFeeds ? '▲' : '▼'}</span>
      </div>
      {showFeeds && (
        <div className="pl-6">
          <div className="p-2 hover:bg-gray-100">➕ Create a custom feed</div>
        </div>
      )}

      <hr className="my-2" />
      <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setShowCommunities(!showCommunities)}>
        <span>Communities</span>
        <span>{showCommunities ? '▲' : '▼'}</span>
      </div>
      {showCommunities && (
        <div className="pl-6">
          <div className="p-2 hover:bg-gray-100">➕ Create a community</div>
          {communities.map((community) => (
            <div key={community.id} className="p-2 flex items-center space-x-2 hover:bg-gray-100">
              <img src={community.icon} alt="" className="w-6 h-6 rounded-full" />
              <Link to={`/r/${community.name}`} className="flex-1">r/{community.name}</Link>
              {/* <Star className="w-4 h-4" /> */}
            </div>
          ))}
        </div>
      )}

      <hr className="my-2" />
      <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setShowResources(!showResources)}>
        <span>Resources</span>
        <span>{showResources ? '▲' : '▼'}</span>
      </div>
      {showResources && (
        <div className="pl-6">
          <div className="p-2 hover:bg-gray-100">
            <Link to="https://www.redditinc.com">About Reddit</Link>
          </div>
          <div className="p-2 hover:bg-gray-100">
            <Link to="https://support.reddithelp.com">Help</Link>
          </div>
          <div className="p-2 hover:bg-gray-100">
            <Link to="https://redditblog.com">Blog</Link>
          </div>
          <div className="p-2 hover:bg-gray-100">
            <Link to="https://www.redditinc.com/careers">Careers</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
