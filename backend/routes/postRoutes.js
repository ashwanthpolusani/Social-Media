import express from "express";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// CREATE Post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { description, user } = req.body;
    const newPost = new Post({
      image: req.file ? req.file.filename : undefined, // store only filename
      description,
      user,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ All Posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username email").sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ Single Post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", "username email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE Post
router.put("/:id", async (req, res) => {
  try {
    const { description } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { description },
      { new: true }
    );
    if (!updatedPost) return res.status(404).json({ message: "Post not found" });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Post
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LIKE post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
      await post.save();
    }
    res.json({ message: "Liked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UNLIKE post
router.put("/:id/unlike", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.likes = post.likes.filter(id => id.toString() !== req.body.userId);
    await post.save();
    res.json({ message: "Unliked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD comment
router.post("/:id/comments", async (req, res) => {
  try {
    const { text, userId } = req.body;
    const comment = new Comment({ text, user: userId, post: req.params.id });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET comments for a post
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate("user", "username");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE comment
router.put("/:postId/comments/:commentId", async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { text },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE comment
router.delete("/:postId/comments/:commentId", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
