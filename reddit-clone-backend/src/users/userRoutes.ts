import { Router } from "express";
import { getLoggedInUser } from "./userController"; 
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", protect, getLoggedInUser);

export default router;
