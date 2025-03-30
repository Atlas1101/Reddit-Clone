import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import path from "path";

// Routes
import authRoutes from "./authentication/authRoutes";
import postRoutes from "./posts/postRoutes";
import commentRoutes from "./comments/commentRoutes";
import voteRoutes from "./votes/voteRoutes";
import userRoutes from "./users/userRoutes";
import communityRoutes from "./community/communityRoutes";
import { protect } from "./middleware/authMiddleware";
import "./users/userSchema";
import "./posts/postSchema";
import "./community/communitySchema";

console.log("__dirname:", __dirname);

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173", // or your frontend origin
        credentials: true,
    })
);

app.use(cookieParser());

//multer images
app.use("/uploads", express.static(path.resolve(__dirname, "../../uploads")));

app.get("/test-image", (req, res) => {
    res.sendFile(path.join(__dirname, "../../uploads/1742919694797-image.jpg"));
});

// Route registration
app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/communities", communityRoutes);
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
