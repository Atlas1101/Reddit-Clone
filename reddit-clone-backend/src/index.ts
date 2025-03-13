import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";

//routes
import postRoutes from "./routes/postRoutes";

import "./models/userSchema"; // Ensure User schema is loaded
import "./models/postSchema";
dotenv.config();
connectDB();

const app = express();

// middleware 
app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT} you fookin legend`)
);
