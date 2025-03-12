import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/userSchema";
import Post from "../models/postSchema";
import Comment from "../models/commentSchema";
import Vote from "../models/voteSchema";
import connectDB from "./db";

dotenv.config();
connectDB();

const seedDatabase = async () => {
    try {
        console.log("Seeding database...");

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        await Comment.deleteMany({});
        await Vote.deleteMany({});
        console.log("Existing data cleared.");

        // Create Users
        const users = await User.insertMany([
            {
                username: "john_doe",
                email: "john@example.com",
                password: await bcrypt.hash("password123", 10),
            },
            {
                username: "jane_doe",
                email: "jane@example.com",
                password: await bcrypt.hash("password123", 10),
            },
        ]);
        console.log("Users seeded.");

        // Create Posts
        const posts = await Post.insertMany([
            {
                title: "My First Post",
                content: "This is my first post on this platform!",
                author: users[0]._id,
                community: "general",
            },
            {
                title: "Learning MongoDB",
                content: "How do you properly structure a MongoDB database?",
                author: users[1]._id,
                community: "mongodb",
            },
        ]);
        console.log("Posts seeded.");

        // Create Comments (Nested)
        const comments = await Comment.insertMany([
            {
                content: "Nice post!",
                author: users[1]._id,
                post: posts[0]._id,
            },
            {
                content: "Thanks!",
                author: users[0]._id,
                post: posts[0]._id,
                parentComment: null,
            },
            {
                content: "Check out Mongoose!",
                author: users[0]._id,
                post: posts[1]._id,
            },
        ]);
        console.log("Comments seeded.");

        // Create Votes
        await Vote.insertMany([
            {
                user: users[0]._id,
                entityType: "post",
                entityId: posts[0]._id,
                voteType: 1,
            },
            {
                user: users[1]._id,
                entityType: "post",
                entityId: posts[1]._id,
                voteType: -1,
            },
        ]);
        console.log("Votes seeded.");

        console.log("Database seeding completed!");
        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
