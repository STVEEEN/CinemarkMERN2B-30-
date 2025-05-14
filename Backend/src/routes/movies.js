import express from "express";
import multer from "multer";
import movieController from "../controllers/movieController.js"

const router = express.Router();

const upload = multer({dest: "public/"})

router.route("/")

.get(movieController.getAllPosts)
.post(upload.single("image"), movieController.createPost);

export default router;