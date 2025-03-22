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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema_1 = __importDefault(require("../users/userSchema"));
const postSchema_1 = __importDefault(require("../posts/postSchema"));
const commentSchema_1 = __importDefault(require("../comments/commentSchema"));
const voteSchema_1 = __importDefault(require("../votes/voteSchema"));
const db_1 = __importDefault(require("./db"));
dotenv_1.default.config();
(0, db_1.default)();
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Seeding database...");
        // Clear existing data
        yield userSchema_1.default.deleteMany({});
        yield postSchema_1.default.deleteMany({});
        yield commentSchema_1.default.deleteMany({});
        yield voteSchema_1.default.deleteMany({});
        console.log("Existing data cleared.");
        // Create Users
        const users = yield userSchema_1.default.insertMany([
            {
                username: "john_doe",
                email: "john@example.com",
                password: yield bcryptjs_1.default.hash("password123", 10),
            },
            {
                username: "jane_doe",
                email: "jane@example.com",
                password: yield bcryptjs_1.default.hash("password123", 10),
            },
        ]);
        console.log("Users seeded.");
        // Create Posts
        const posts = yield postSchema_1.default.insertMany([
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
        const comments = yield commentSchema_1.default.insertMany([
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
        yield voteSchema_1.default.insertMany([
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
    }
    catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
});
seedDatabase();
