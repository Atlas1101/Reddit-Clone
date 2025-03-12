import express from "express";
import {
    getAllPosts,
    getPostById,
    createPost,
} from "../controllers/postController";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", createPost);

export default router;
