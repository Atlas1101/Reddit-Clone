"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserService = exports.registerUserService = void 0;
const userSchema_1 = __importDefault(require("../users/userSchema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
// ✅ Register new user
const registerUserService = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = input;
    const existingUser = yield userSchema_1.default.findOne({ email });
    if (existingUser) {
        throw new Error("Email already registered");
    }
    const newUser = new userSchema_1.default({ username, email, password });
    yield newUser.save();
    return newUser;
});
exports.registerUserService = registerUserService;
// ✅ Login user
const loginUserService = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = input;
    const user = yield userSchema_1.default.findOne({ email });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isPasswordValid = yield user.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "7d",
    });
    return { token, user };
});
exports.loginUserService = loginUserService;
