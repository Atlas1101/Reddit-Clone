import { Outlet } from "react-router-dom";
import Navbar from "./NavBar/Navbar";

export default function Layout() {
    return (
        <div className="min-h-screen bg-white p-2">
            <Navbar />
            <main className="">
                <Outlet />
            </main>
        </div>
    );
}
