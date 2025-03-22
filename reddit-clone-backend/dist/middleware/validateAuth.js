"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = exports.postSchema = exports.userLoginSchema = exports.userRegisterSchema = exports.objectIdSchema = void 0;
const zod_1 = require("zod");
// Helper function to validate MongoDB ObjectId
exports.objectIdSchema = zod_1.z.string().length(24, "Invalid ObjectId format");
// User Registration Schema
exports.userRegisterSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username must be at least 3 characters long"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
// User Login Schema
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
// Validate Post Zod Schema
exports.postSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    content: zod_1.z.string().min(10, "Content must be at least 10 characters"),
    author: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid author ID"), // Ensures it's a valid MongoDB ObjectId
    community: zod_1.z.string().min(1, "Community is required"),
    createdAt: zod_1.z.date().optional(), // Mongoose timestamps handle this
});
// Zod schema for a comment
exports.commentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, "Content cannot be empty"),
    author: exports.objectIdSchema, // Must be a valid MongoDB ObjectId
    postId: exports.objectIdSchema, // Must be a valid MongoDB ObjectId
    parentCommentId: zod_1.z.string().length(24).optional(), // Optional for replies
});
