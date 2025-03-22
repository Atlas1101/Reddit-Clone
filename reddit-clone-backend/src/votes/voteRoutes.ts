import express from "express";
import { castVote, removeVote } from "./voteController";
import { protect } from "../middleware/authMiddleware"; // or wherever your auth is

const router = express.Router();

router.post("/", protect, castVote);
router.delete("/", protect, removeVote);

export default router;
