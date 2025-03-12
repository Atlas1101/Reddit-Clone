import { z } from "zod";

// Validate Post Zod Schema
export const postSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    author: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid author ID"), // Ensures it's a valid MongoDB ObjectId
    community: z.string().min(1, "Community is required"),
    createdAt: z.date().optional(), // Mongoose timestamps handle this
});

//  TypeScript type inference (optional)
export type PostSchemaType = z.infer<typeof postSchema>;
