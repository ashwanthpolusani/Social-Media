import multer from "multer";
import path from "path";

// Storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    cb("❌ Only .jpg, .jpeg, .png allowed!");
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
