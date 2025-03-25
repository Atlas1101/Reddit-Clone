import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../users/userSchema";

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

interface DecodedUser {
  id: string;
  email: string;
}
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  // First check for Bearer token in Authorization header
  // if (
  //     req.headers.authorization &&
  //     req.headers.authorization.startsWith("Bearer")
  // ) {
  //     token = req.headers.authorization.split(" ")[1];
  // }

  // If not in header, try from cookie
  if (!token && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    console.log("no token provided");
    
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }


  let decoded;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedUser;
  } catch (error) {
    console.log("failed to verify token", error);
    
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }


  let user;
  try {
    user = await User.findById(decoded.id).select("-password");
  } catch (error) {
    console.log("failed to find user",error);
    res.status(500).json({ message: "server error " });
    return
  }
  if (!user) {
    console.log("user not found ");
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }

  req.user = { id: user._id.toString(), email: user.email };
  next();
};
