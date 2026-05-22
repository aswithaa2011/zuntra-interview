import express from "express";
import {
  getPosts, getPost, createPost, deletePost,
  likePost, savePost, addComment,
  getUserPosts, getSavedPosts
} from "../controller/postController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/saved", auth, getSavedPosts);
router.get("/user/:userId", getUserPosts);
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.delete("/:id", auth, deletePost);
router.post("/:id/like", auth, likePost);
router.post("/:id/save", auth, savePost);
router.post("/:id/comment", auth, addComment);

export default router;
