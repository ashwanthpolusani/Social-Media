import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Create a user
router.post("/", async (req, res) => {
  try {
    const user = new User({ username: req.body.username, bio: req.body.bio });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Follow user
router.put("/:id/follow", async (req, res) => {
  const currentUser = await User.findById(req.body.userId);
  const targetUser = await User.findById(req.params.id);

  if (!currentUser.following.includes(targetUser._id)) {
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);
    await currentUser.save();
    await targetUser.save();
  }

  res.json({ message: "Followed user" });
});

// Unfollow user
router.put("/:id/unfollow", async (req, res) => {
  const currentUser = await User.findById(req.body.userId);
  const targetUser = await User.findById(req.params.id);

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUser._id.toString()
  );
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUser._id.toString()
  );

  await currentUser.save();
  await targetUser.save();

  res.json({ message: "Unfollowed user" });
});

// Get single user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-__v");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
});

// Update user profile
router.put("/:id", async (req, res) => {
  try {
    const { username, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, bio },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
