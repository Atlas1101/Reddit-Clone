"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../posts/postController");
const authMiddleware_1 = require("../middleware/authMiddleware"); // adjust path if needed
const router = express_1.default.Router();
// Public
router.get("/", postController_1.getAllPosts);
router.get("/:id", postController_1.getPostById);
// Protected
router.post("/", authMiddleware_1.protect, postController_1.createPost);
router.put("/:id", authMiddleware_1.protect, postController_1.updatePost);
router.delete("/:id", authMiddleware_1.protect, postController_1.deletePost);
exports.default = router;
