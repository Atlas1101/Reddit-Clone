import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends mongoose.Document {
    _id: mongoose.Types.ObjectId; // ✅ Explicitly define _id type
    username: string;
    email: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>;
    generateAuthToken: () => string;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
UserSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id.toString(), email: this.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    );
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
