import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import PostPage from "../pages/PostPage";
import Profile from "../pages/Profile";
import PostForm from "../features/posts/PostForm";
import CommunityPage from "../pages/CommunityPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/post/:id", element: <PostPage /> },
            { path: "/user/:username", element: <Profile /> },
            { path: "/submit", element: <PostForm /> },
            { path: "/r/:name", element: <CommunityPage /> },
            

          
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
