import { Request, Response, RequestHandler } from "express";
import Post from "../models/postSchema";
import User from "../models/userSchema";
import { z } from "zod";
import { postSchema } from "../middleware/validateAuth";
// @desc    Get all posts
// @route   GET /api/posts

export const getAllPosts: RequestHandler = async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "username");

        if (posts.length === 0) {
            res.status(404).json({ message: "No posts found" }); // ❌ Don't return Response
            return; // ✅ Stop execution without returning Response
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error("Errornrp fetching posts:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Server error", error: errorMessage });
    }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
export const getPostById: RequestHandler = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate(
            "author",
            "username"
        );

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

//Create Post
export const createPost: RequestHandler = async (req, res) => {
    try {
        const validatedData = postSchema.parse(req.body);
        const newPost = new Post(validatedData);
        await newPost.save();
        res.status(201).json({ post: newPost, message: "new post" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

//Update Post

export const updatePost: RequestHandler = async (req, res) => {
    try {
        // Validate request body
        const validatedData = postSchema.partial().parse(req.body); // `.partial()` allows updating only some fields

        // Find the post and update it
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id, // ID from URL
            validatedData, // Data to update
            { new: true, runValidators: true } // Return updated post & run validation
        );

        // If post not found
        if (!updatedPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        res.status(200).json({
            post: updatedPost,
            message: "Post updated successfully",
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

//Delete Post

export const deletePost: RequestHandler = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
