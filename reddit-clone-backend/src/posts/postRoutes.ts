import express from "express";
import {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getPostsByUser,
} from "../posts/postController";
import { protect } from "../middleware/authMiddleware";
import { upload } from "../middleware/upload"; // ✅ multer middleware

const router = express.Router();

// Public
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected
router.post("/", protect, upload.single("image"), createPost); // ✅ updated
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.get("/user/me", protect, getPostsByUser); // ✅ moved to avoid route conflict

export default router;
