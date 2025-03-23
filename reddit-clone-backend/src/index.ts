import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";

// Routes
import authRoutes from "./authentication/authRoutes";
import postRoutes from "./posts/postRoutes";
import commentRoutes from "./comments/commentRoutes";
import voteRoutes from "./votes/voteRoutes";
import userRoutes from "./users/userRoutes";


import "./users/userSchema";
import "./posts/postSchema";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5000", // or your frontend origin
        credentials: true,
    })
);

app.use(cookieParser());

// Route registration
app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/votes", voteRoutes);

app.get("/", (req, res) => {
    res.send("API is running...aww yeee");
});

// Optional: 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not foundaa" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT} you fookin legenddd`)
);
