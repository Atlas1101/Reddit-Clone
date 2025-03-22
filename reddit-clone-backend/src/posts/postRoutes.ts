import express from "express";
import {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
} from "../posts/postController";
import { protect } from "../middleware/authMiddleware"; // adjust path if needed

const router = express.Router();

// Public
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
