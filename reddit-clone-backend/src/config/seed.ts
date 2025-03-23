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

        // Clear existing data
        await User.deleteMany({});
        await Community.deleteMany({});
        await Post.deleteMany({});
        await Comment.deleteMany({});
        await Vote.deleteMany({});
        console.log("🗑️ Existing data cleared.");

        // Create Users
        const users = await User.insertMany([
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

        // Create Communities
        const communities = await Community.insertMany([
            {
                name: "WebDev",
                description: "A community for web developers.",
                createdBy: users[0]._id,
                moderators: [users[0]._id],
                members: [users[0]._id, users[1]._id],
                rules: [
                    { title: "Be Respectful", description: "Treat all members with respect." },
                    { title: "No Spam", description: "Avoid spam and self-promotion." },
                ],
            },
            {
                name: "ReactJS",
                description: "All about React and related libraries.",
                createdBy: users[1]._id,
                moderators: [users[1]._id],
                members: [users[0]._id, users[1]._id],
                rules: [
                    { title: "Stay On Topic", description: "Keep discussions relevant to React." },
                    { title: "No Hate Speech", description: "Be respectful and considerate." },
                ],
            },
        ]);
        console.log("🌐 Communities seeded.");

        console.log("✅ Database seeding completed!");
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
