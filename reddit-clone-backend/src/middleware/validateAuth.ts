import { z } from "zod";

// ✅ Helper: MongoDB ObjectId
export const objectIdSchema = z.string().length(24, "Invalid ObjectId format");

// ✅ User Registration Schema
export const userRegisterSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// ✅ User Login Schema
export const userLoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// ✅ Post Input Schema — what the client can send
export const createPostInputSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content must be at least 1 characters"),
    community: z.string().min(1, "Community is required"),
    postType: z.enum(["text", "image", "link", "poll"]),
});

// ✅ Full Post Schema — used internally with injected fields
export const postSchema = createPostInputSchema.extend({
    author: objectIdSchema,
    createdAt: z.date().optional(),
});

// ✅ Comment Input Schema — what the client sends
export const createCommentInputSchema = z.object({
    content: z.string().min(1, "Content cannot be empty"),
    postId: objectIdSchema,
    parentCommentId: z.string().length(24).optional(), // reply support
});

// ✅ Full Comment Schema — backend-only with author injected
export const commentSchema = createCommentInputSchema.extend({
    author: objectIdSchema,
});

export const communityRuleSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
});

export const createCommunitySchema = z.object({
    name: z.string().min(3).max(100),
    description: z.string().optional(),
    icon: z.string().url().optional(),
    rules: z.array(communityRuleSchema).optional(),
});

// ✅ Type Inference for TypeScript
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;

export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type PostSchemaType = z.infer<typeof postSchema>;

export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;
export type CommentInput = z.infer<typeof commentSchema>;

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
// import { z } from "zod";

// // Helper function to validate MongoDB ObjectId
// export const objectIdSchema = z.string().length(24, "Invalid ObjectId format");

// // User Registration Schema
// export const userRegisterSchema = z.object({
//     username: z.string().min(3, "Username must be at least 3 characters long"),
//     email: z.string().email("Invalid email format"),
//     password: z.string().min(6, "Password must be at least 6 characters long"),
// });

// // User Login Schema
// export const userLoginSchema = z.object({
//     email: z.string().email("Invalid email format"),
//     password: z.string().min(6, "Password must be at least 6 characters long"),
// });

// // Type Inference for TypeScript
// export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
// export type UserLoginInput = z.infer<typeof userLoginSchema>;

// // Validate Post Zod Schema
// export const postSchema = z.object({
//     title: z.string().min(1, "Title is required"),
//     content: z.string().min(10, "Content must be at least 10 characters"),
//     author: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid author ID"), // Ensures it's a valid MongoDB ObjectId
//     community: z.string().min(1, "Community is required"),
//     createdAt: z.date().optional(), // Mongoose timestamps handle this
// });

// //  TypeScript type inference (optional)
// export type PostSchemaType = z.infer<typeof postSchema>;

// // Zod schema for a comment
// export const commentSchema = z.object({
//     content: z.string().min(1, "Content cannot be empty"),
//     author: objectIdSchema, // Must be a valid MongoDB ObjectId
//     postId: objectIdSchema, // Must be a valid MongoDB ObjectId
//     parentCommentId: z.string().length(24).optional(), // Optional for replies
// });

// //  TypeScript type inference (optional)
// export type CommentInput = z.infer<typeof commentSchema>;
