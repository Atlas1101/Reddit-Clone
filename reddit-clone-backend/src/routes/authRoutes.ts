import express from "express";
import { registerUser, loginUser } from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser); // ✅ Add this if missing

export default router;
