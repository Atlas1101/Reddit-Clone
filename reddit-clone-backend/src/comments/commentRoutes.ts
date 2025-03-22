import express from "express";
import {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
} from "./commentController";
import { protect } from "../middleware/authMiddleware"; // or wherever your auth middleware lives

const router = express.Router();

// Public
router.get("/post/:postId", getCommentsByPost);

// Protected
router.post("/", protect, createComment);
router.patch("/:commentId", protect, updateComment);
router.delete("/:commentId", protect, deleteComment);

export default router;
