import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import PostPage from "../pages/PostPage";
import Profile from "../pages/Profile";
import Login from "../components/NavBar/Login"; // Updated import path
import Register from "../features/auth/Register";
import PostForm from "../features/posts/PostForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/post/:id", element: <PostPage /> },
            { path: "/user/:username", element: <Profile /> },
            { path: "/submit", element: <PostForm /> },
          
        ],
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
