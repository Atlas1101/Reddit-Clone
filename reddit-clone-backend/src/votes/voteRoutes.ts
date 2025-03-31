import express from "express";
import { castVote, removeVote, getVoteScore } from "./voteController";
import { protect } from "../middleware/authMiddleware"; // or wherever your auth is

const router = express.Router();

router.post("/", protect, castVote);
router.delete("/", protect, removeVote); // to be deleted
router.get("/score", getVoteScore);

export default router;
