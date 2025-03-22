import User from "../users/userSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserLoginInput, UserRegisterInput } from "../middleware/validateAuth";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ Register new user
export const registerUserService = async (input: UserRegisterInput) => {
    const { username, email, password } = input;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email already registered");
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    return newUser;
};

// ✅ Login user
export const loginUserService = async (input: UserLoginInput) => {
    const { email, password } = input;

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
    });

    return { token, user };
};
