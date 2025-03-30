import express, { Router } from "express";
import { getLoggedInUser, getUserCommunities, getUserByUsername  } from "./userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", protect, getLoggedInUser);
router.get("/", getUserByUsername);
router.get("/:userId/communities", protect, getUserCommunities);

export default router;
