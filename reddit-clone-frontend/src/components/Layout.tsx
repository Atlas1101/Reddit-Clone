import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="min-h-screen bg-white p-2">
            <Navbar />
            <main className="max-w-4xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
