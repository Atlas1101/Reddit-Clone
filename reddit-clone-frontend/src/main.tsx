import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router";
import "./index.css";
import { AuthModalProvider } from "./context/AuthModalContext";
import { UserProvider } from "./context/UserContext"; // Import UserProvider

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <UserProvider> {/* Wrap your entire app */}
            <AuthModalProvider>
                <AppRouter />
            </AuthModalProvider>
        </UserProvider>
    </React.StrictMode>
);
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.tsx";

// createRoot(document.getElementById("root")!).render(
//     <StrictMode>
//         <App />
//     </StrictMode>
// );
