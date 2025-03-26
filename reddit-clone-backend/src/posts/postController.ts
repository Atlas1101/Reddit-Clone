import { Request, Response } from "express";
import Post from "../posts/postSchema";
import { z } from "zod";
import {
    getAllPostsService,
    getPostByIdService,
    createPostService,
    updatePostService,
    deletePostService,
} from "../posts/postService";
import { createPostInputSchema } from "../middleware/validateAuth";

// ✅ Authenticated request type
interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

// @desc    Get all posts
// @route   GET /api/posts
export const getAllPosts = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const posts = await getAllPostsService(); // will populate community

        if (posts.length === 0) {
            res.status(404).json({ message: "No posts found" });
            return;
        }

        const formattedPosts = posts.map((post) => {
            const postObj = post.toObject();
            const community = postObj.community;

            const isPopulated =
                typeof community === "object" &&
                community !== null &&
                "name" in community;

            return {
                ...postObj,
                subreddit: isPopulated ? community.name : undefined,
                subredditIcon: isPopulated ? community.icon : undefined,
                subredditDescription: isPopulated
                    ? community.description
                    : undefined,
                subredditBanner: isPopulated
                    ? community.bannerImage
                    : undefined,
                communityId: isPopulated ? community._id : undefined,

                imageUrl: post.postType === "image" ? post.content : undefined,
            };
        });

        res.status(200).json(formattedPosts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
export const getPostById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const post = await getPostByIdService(req.params.id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        const postObj = post.toObject();
        const community = postObj.community;

        const isPopulated =
            typeof community === "object" &&
            community !== null &&
            "name" in community;

        res.status(200).json({
            ...postObj,
            subreddit: isPopulated ? community.name : undefined,
            subredditIcon: isPopulated ? community.icon : undefined,
            subredditDescription: isPopulated
                ? community.description
                : undefined,
            subredditBanner: isPopulated ? community.bannerImage : undefined,
            communityId: isPopulated ? community._id : undefined,

            imageUrl: post.postType === "image" ? post.content : undefined,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Create a post
// @route   POST /api/posts

export const createPost = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        // extract from body
        const { title, community, postType, content, linkUrl } = req.body;

        // determine final content
        let finalContent = content;

        if (postType === "image") {
            if (!req.file) {
                res.status(400).json({ message: "Image is required" });
                return;
            }
            finalContent = `/uploads/${req.file.filename}`;
        }

        if (postType === "link") {
            if (!linkUrl) {
                res.status(400).json({ message: "Link is required" });
                return;
            }
            finalContent = linkUrl;
        }

        // Validate using Zod
        const parsed = createPostInputSchema.parse({
            title,
            postType,
            community,
            content: finalContent,
        });

        // Pass to service
        const newPost = await createPostService(parsed, req.user.id.toString());

        res.status(201).json({
            post: {
                ...newPost.toObject(), // flatten the Mongoose document
                imageUrl:
                    newPost.postType === "image" ? newPost.content : undefined,
            },
            message: "New post created",
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

// @desc    Update a post
// @route   PATCH /api/posts/:id
// @desc    Update a post
// @route   PATCH /api/posts/:id
export const updatePost = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const updatedPost = await updatePostService(
            req.params.id,
            req.body,
            req.user.id
        );

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

        const message =
            error instanceof Error
                ? error.message === "Unauthorized"
                    ? "Unauthorized to update this post"
                    : error.message
                : "Error updating post";

        const status =
            message === "Unauthorized to update this post"
                ? 403
                : message === "Post not found"
                ? 404
                : 500;

        res.status(status).json({
            message,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
export const deletePost = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized: User not authenticated",
            });
            return;
        }

        const result = await deletePostService(req.params.id, req.user.id);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }

        const message =
            error instanceof Error
                ? error.message === "Unauthorized"
                    ? "Unauthorized to delete this post"
                    : error.message
                : "Error deleting post";

        const status =
            message === "Unauthorized to delete this post"
                ? 403
                : message === "Post not found"
                ? 404
                : 500;

        res.status(status).json({
            message,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const getPostsByUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { authorId } = req.query;

    try {
        const posts = await Post.find({ author: authorId }).sort({
            createdAt: -1,
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
