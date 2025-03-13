import { z } from "zod";

// Helper function to validate MongoDB ObjectId
export const objectIdSchema = z.string().length(24, "Invalid ObjectId format");

// User Registration Schema
export const userRegisterSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// User Login Schema
export const userLoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Type Inference for TypeScript
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;

// Validate Post Zod Schema
export const postSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    author: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid author ID"), // Ensures it's a valid MongoDB ObjectId
    community: z.string().min(1, "Community is required"),
    createdAt: z.date().optional(), // Mongoose timestamps handle this
});
export type PostSchemaType = z.infer<typeof postSchema>;

// Zod schema for a comment
export const commentSchema = z.object({
    content: z.string().min(1, "Content cannot be empty"),
    author: objectIdSchema, // Must be a valid MongoDB ObjectId
    postId: objectIdSchema, // Must be a valid MongoDB ObjectId
    parentCommentId: z.string().length(24).optional(), // Optional for replies
});

//  TypeScript type inference (optional)
export type CommentInput = z.infer<typeof commentSchema>;
