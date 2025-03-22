"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("./commentController");
const authMiddleware_1 = require("../middleware/authMiddleware"); // or wherever your auth middleware lives
const router = express_1.default.Router();
// Public
router.get("/post/:postId", commentController_1.getCommentsByPost);
// Protected
router.post("/", authMiddleware_1.protect, commentController_1.createComment);
router.patch("/:commentId", authMiddleware_1.protect, commentController_1.updateComment);
router.delete("/:commentId", authMiddleware_1.protect, commentController_1.deleteComment);
exports.default = router;
