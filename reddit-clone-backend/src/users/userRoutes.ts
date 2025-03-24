import { Router } from "express";
import { getLoggedInUser, getUserCommunities } from "./userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", protect, getLoggedInUser);
router.get("/:userId/communities", protect, getUserCommunities);

export default router;
