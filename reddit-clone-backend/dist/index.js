"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
// Routes
const authRoutes_1 = __importDefault(require("./authentication/authRoutes"));
const postRoutes_1 = __importDefault(require("./posts/postRoutes"));
const commentRoutes_1 = __importDefault(require("./comments/commentRoutes"));
const voteRoutes_1 = __importDefault(require("./votes/voteRoutes"));
require("./users/userSchema");
require("./posts/postSchema");
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
// Route registration
app.use("/api/auth", authRoutes_1.default);
app.use("/api/posts", postRoutes_1.default);
app.use("/api/comments", commentRoutes_1.default);
app.use("/api/votes", voteRoutes_1.default);
app.get("/", (req, res) => {
    res.send("API is running...");
});
// Optional: 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} you fookin legend`));
