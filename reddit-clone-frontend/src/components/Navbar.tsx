import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-white shadow p-4 mb-6">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <Link to="/" className="font-bold text-xl text-blue-600">
                    RedditClone
                </Link>
                <div className="space-x-4">
                    <Link to="/login" className="text-gray-700">
                        Login
                    </Link>
                    <Link to="/register" className="text-gray-700">
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
}
