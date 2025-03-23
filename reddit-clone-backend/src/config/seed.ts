import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../users/userSchema";
import Post from "../posts/postSchema";
import Comment from "../comments/commentSchema";
import Vote from "../votes/voteSchema";
import Community from "../community/communitySchema";
import connectDB from "./db";

dotenv.config();
connectDB();

const seedDatabase = async () => {
    try {
        console.log("🌱 Seeding database...");

        // Clear all collections
        await User.deleteMany({});
        await Community.deleteMany({});
        await Post.deleteMany({});
        await Comment.deleteMany({});
        await Vote.deleteMany({});
        console.log("🗑️ Cleared existing data.");

        // Users
        const [john, jane] = await User.insertMany([
            {
                username: "john_doe",
                email: "john@example.com",
                password: await bcrypt.hash("password123", 10),
                karma: 100,
            },
            {
                username: "jane_doe",
                email: "jane@example.com",
                password: await bcrypt.hash("password123", 10),
                karma: 50,
            },
        ]);
        console.log("👤 Users seeded.");

        // Communities
        const [webDev, reactJS] = await Community.insertMany([
            {
                name: "WebDev",
                description: "A community for web developers.",
                createdBy: john._id,
                moderators: [john._id],
                members: [john._id, jane._id],
                rules: [
                    {
                        title: "Be Respectful",
                        description: "Treat all members with respect.",
                    },
                    {
                        title: "No Spam",
                        description: "Avoid spam and self-promotion.",
                    },
                ],
            },
            {
                name: "ReactJS",
                description: "All about React and related libraries.",
                createdBy: jane._id,
                moderators: [jane._id],
                members: [john._id, jane._id],
                rules: [
                    {
                        title: "Stay On Topic",
                        description: "Keep discussions relevant to React.",
                    },
                    {
                        title: "No Hate Speech",
                        description: "Be respectful and considerate.",
                    },
                ],
            },
        ]);
        console.log("🌐 Communities seeded.");

        // Posts
        const [post1, post2] = await Post.insertMany([
            {
                title: "Welcome to WebDev!",
                content: "Introduce yourself here.",
                author: john._id,
                community: webDev.name,
                postType: "text",
                commentCount: 2,
            },
            {
                title: "ReactJS Tips",
                content: "Use hooks wisely!",
                author: jane._id,
                community: reactJS.name,
                postType: "text",
                commentCount: 1,
            },
        ]);
        console.log("📝 Posts seeded.");

        // Comments
        const [comment1, comment2, comment3] = await Comment.insertMany([
            {
                content: "Glad to be here!",
                author: jane._id,
                post: post1._id,
                repliesCount: 1,
            },
            {
                content: "Welcome :)",
                author: john._id,
                post: post1._id,
                parentComment: undefined,
                repliesCount: 0,
            },
            {
                content: "Thanks for the tips!",
                author: john._id,
                post: post2._id,
                repliesCount: 0,
            },
        ]);
        console.log("💬 Comments seeded.");

        // Votes
        await Vote.insertMany([
            {
                user: john._id,
                entityType: "post",
                entityId: post1._id,
                voteType: 1,
            },
            {
                user: jane._id,
                entityType: "comment",
                entityId: comment1._id,
                voteType: 1,
            },
        ]);
        console.log("👍 Votes seeded.");

        console.log("✅ Seeding complete!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    }
};

seedDatabase();
