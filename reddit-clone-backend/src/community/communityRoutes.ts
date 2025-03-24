import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
    createCommunity,
    getCommunityById,
    updateCommunity,
    deleteCommunity,
    joinCommunity,
    leaveCommunity,
    addCommunityRule,
    getAllCommunities,
} from "../community/communityController";

const router = Router();

// Create a community
router.post("/", protect, createCommunity);

// Get community by ID
router.get("/:id", getCommunityById);

// GET /api/communities — get all communities for selection
router.get("/", getAllCommunities);

// Update a community
router.patch("/:id", protect, updateCommunity);

// Delete a community
router.delete("/:id", protect, deleteCommunity);

// Join a community
router.post("/:id/join", protect, joinCommunity);

// Leave a community
router.post("/:id/leave", protect, leaveCommunity);

// Add a community rule
router.post("/:id/rules", protect, addCommunityRule);

export default router;
