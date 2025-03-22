"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const voteController_1 = require("./voteController");
const authMiddleware_1 = require("../middleware/authMiddleware"); // or wherever your auth is
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, voteController_1.castVote);
router.delete("/", authMiddleware_1.protect, voteController_1.removeVote);
exports.default = router;
