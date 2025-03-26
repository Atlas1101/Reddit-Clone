import multer from "multer";
import path from "path";
import fs from "fs";

// Set destination folder
const uploadDir = path.resolve(__dirname, "../../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // ✅ corrected path
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed"), false);
    }
};

export const upload = multer({ storage, fileFilter });
