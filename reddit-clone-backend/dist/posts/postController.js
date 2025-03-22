"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.createPost = exports.getPostById = exports.getAllPosts = void 0;
const zod_1 = require("zod");
const postService_1 = require("../posts/postService");
// @desc    Get all posts
// @route   GET /api/posts
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield (0, postService_1.getAllPostsService)();
        if (posts.length === 0) {
            res.status(404).json({ message: "No posts found" });
            return;
        }
        res.status(200).json(posts);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getAllPosts = getAllPosts;
// @desc    Get a single post by ID
// @route   GET /api/posts/:id
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield (0, postService_1.getPostByIdService)(req.params.id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getPostById = getPostById;
// @desc    Create a post
// @route   POST /api/posts
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPost = yield (0, postService_1.createPostService)(req.body);
        res.status(201).json({ post: newPost, message: "New post created" });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.createPost = createPost;
// @desc    Update a post
// @route   PATCH /api/posts/:id
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPost = yield (0, postService_1.updatePostService)(req.params.id, req.body);
        if (!updatedPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json({
            post: updatedPost,
            message: "Post updated successfully",
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updatePost = updatePost;
// @desc    Delete a post
// @route   DELETE /api/posts/:id
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized: User not authenticated",
            });
            return;
        }
        const result = yield (0, postService_1.deletePostService)(req.params.id, req.user.id);
        res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        const message = error instanceof Error
            ? error.message === "Unauthorized"
                ? "Unauthorized to delete this post"
                : error.message
            : "Error deleting post";
        const status = message === "Unauthorized to delete this post"
            ? 403
            : message === "Post not found"
                ? 404
                : 500;
        res.status(status).json({
            message,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deletePost = deletePost;
// import { Request, Response, RequestHandler } from "express";
// import mongoose from "mongoose";
// import User from "../users/userSchema";
// import Post from "./postSchema";
// import Comment from "../comments/commentSchema";
// import Vote from "../votes/voteSchema";
// import { z } from "zod";
// import { postSchema, objectIdSchema } from "../middleware/validateAuth";
// // @desc    Get all posts
// // @route   GET /api/posts
// // ✅ Define Authenticated Request Type
// interface AuthRequest extends Request {
//     user?: { id: string; email: string };
// }
// export const getAllPosts: RequestHandler = async (req, res) => {
//     try {
//         const posts = await Post.find().populate("author", "username");
//         if (posts.length === 0) {
//             res.status(404).json({ message: "No posts found" }); // ❌ Don't return Response
//             return; // ✅ Stop execution without returning Response
//         }
//         res.status(200).json(posts);
//     } catch (error) {
//         console.error("Errornrp fetching posts:", error);
//         const errorMessage =
//             error instanceof Error ? error.message : "Unknown error";
//         res.status(500).json({ message: "Server error", error: errorMessage });
//     }
// };
// // @desc    Get a single post by ID
// // @route   GET /api/posts/:id
// export const getPostById: RequestHandler = async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id).populate(
//             "author",
//             "username"
//         );
//         if (!post) {
//             res.status(404).json({ message: "Post not found" });
//             return;
//         }
//         res.status(200).json(post);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// };
// //Create Post
// export const createPost: RequestHandler = async (req, res) => {
//     try {
//         const validatedData = postSchema.parse(req.body);
//         const newPost = new Post(validatedData);
//         await newPost.save();
//         res.status(201).json({ post: newPost, message: "new post" });
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             res.status(400).json({
//                 message: "Validation error",
//                 errors: error.errors,
//             });
//             return;
//         }
//         console.error("Server error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };
// //Update Post
// export const updatePost: RequestHandler = async (req, res) => {
//     try {
//         // Validate request body
//         const validatedData = postSchema.partial().parse(req.body); // `.partial()` allows updating only some fields
//         // Find the post and update it
//         const updatedPost = await Post.findByIdAndUpdate(
//             req.params.id, // ID from URL
//             validatedData, // Data to update
//             { new: true, runValidators: true } // Return updated post & run validation
//         );
//         // If post not found
//         if (!updatedPost) {
//             res.status(404).json({ message: "Post not found" });
//             return;
//         }
//         res.status(200).json({
//             post: updatedPost,
//             message: "Post updated successfully",
//         });
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             res.status(400).json({
//                 message: "Validation error",
//                 errors: error.errors,
//             });
//             return;
//         }
//         console.error("Server error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };
// //Delete Post
// // export const deletePost: RequestHandler = async (req, res) => {
// //     try {
// //         const deletedPost = await Post.findByIdAndDelete(req.params.id);
// //         if (!deletedPost) {
// //             res.status(404).json({ message: "Post not found" });
// //             return;
// //         }
// //         res.status(200).json({ message: "Post deleted successfully" });
// //     } catch (error) {
// //         console.error("Server error:", error);
// //         res.status(500).json({ message: "Server error" });
// //     }
// // };
// export const deletePost = async (req: AuthRequest, res: Response) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         // ✅ Validate `postId` from params
//         const postId = objectIdSchema.parse(req.params.id);
//         // ✅ Ensure user is authenticated
//         if (!req.user) {
//             return res
//                 .status(401)
//                 .json({ message: "Unauthorized: User not authenticated" });
//         }
//         const userId = req.user.id;
//         // ✅ Find the post
//         const post = await Post.findById(postId).session(session);
//         if (!post) {
//             return res.status(404).json({ message: "Post not found" });
//         }
//         // ✅ Ensure the user is the owner of the post
//         if (post.author.toString() !== userId) {
//             return res
//                 .status(403)
//                 .json({ message: "Unauthorized to delete this post" });
//         }
//         // ✅ Recursive function to find all comments (including nested ones)
//         const getAllNestedComments = async (
//             parentIds: mongoose.Types.ObjectId[]
//         ): Promise<mongoose.Types.ObjectId[]> => {
//             let allComments: mongoose.Types.ObjectId[] = [];
//             const children = await Comment.find({
//                 parentComment: { $in: parentIds },
//             })
//                 .select("_id")
//                 .session(session);
//             if (children.length > 0) {
//                 const childIds: mongoose.Types.ObjectId[] = children.map(
//                     (c) => c._id as mongoose.Types.ObjectId
//                 );
//                 allComments = allComments.concat(
//                     childIds,
//                     await getAllNestedComments(childIds)
//                 );
//             }
//             return allComments;
//         };
//         // ✅ Get all comments (including nested ones) related to the post
//         const postObjectId = new mongoose.Types.ObjectId(postId);
//         const allCommentsToDelete = [
//             ...(await getAllNestedComments([postObjectId])),
//         ];
//         // ✅ Get all votes (post votes + comment votes)
//         const allVotes = await Vote.find({
//             target: { $in: [postId, ...allCommentsToDelete] },
//             targetType: { $in: ["post", "comment"] },
//         })
//             .lean() // ✅ Fixes `.voteType` access issue
//             .session(session);
//         // ✅ Calculate total karma to deduct from the post author
//         const totalKarmaLoss = allVotes.reduce(
//             (sum, vote) => sum + vote.voteType,
//             0
//         );
//         // ✅ Deduct karma from the post author
//         await User.findByIdAndUpdate(
//             post.author,
//             { $inc: { karma: -totalKarmaLoss } },
//             { session }
//         );
//         // ✅ Delete all votes related to the post and its comments
//         await Vote.deleteMany({
//             target: { $in: [postId, ...allCommentsToDelete] },
//             targetType: { $in: ["post", "comment"] },
//         }).session(session);
//         // ✅ Delete all comments (including nested ones)
//         await Comment.deleteMany({ _id: { $in: allCommentsToDelete } }).session(
//             session
//         );
//         // ✅ Delete the post itself
//         await Post.findByIdAndDelete(postId).session(session);
//         // ✅ Commit transaction
//         await session.commitTransaction();
//         session.endSession();
//         return res.status(200).json({ message: "Post deleted successfully" });
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         if (error instanceof z.ZodError) {
//             return res
//                 .status(400)
//                 .json({ message: "Validation error", errors: error.errors });
//         }
//         return res.status(500).json({
//             message: "Error deleting post",
//             error: (error as Error).message,
//         });
//     }
// };
