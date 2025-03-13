import { z } from "zod";

// Validate Post Zod Schema
export const postSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    author: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid author ID"), // Ensures it's a valid MongoDB ObjectId
    community: z.string().min(1, "Community is required"),
    createdAt: z.date().optional(), // Mongoose timestamps handle this
});

export const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  });
  
  export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  });
  
//  TypeScript type inference (optional)
export type PostSchemaType = z.infer<typeof postSchema>;

