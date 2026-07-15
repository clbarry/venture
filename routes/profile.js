import { isAuthenticated } from "../middleware/auth.js";
import ventureDB from "../db/ventureDB.js";
import express from "express";

const router = express.Router();

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const itineraries = await ventureDB.getItineraries({
      creator: req.user.username,
    });
    res.json({
      username: req.user.username,
      email: req.user.email,
      followers: req.user.followers ?? [],
      following: req.user.following ?? [],
      itineraries,
    });
  } catch (err) {
    console.error("Profile fetch failed:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

router.delete("/", isAuthenticated, async (req, res) => {
  try {
    const { _id, username } = req.user;

    await ventureDB.deleteItinerariesByCreator(username);
    await ventureDB.deleteUser(_id);

    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Account deleted, logout failed" });
      req.session.destroy(() => {
        res.json({ message: "Account deleted" });
      });
    });
  } catch (err) {
    console.error("Account deletion failed:", err);
    res.status(500).json({ message: "Failed to delete account" });
  }
});

router.get("/users", isAuthenticated, async (req, res) => {
  try {
    const users = await ventureDB.getAllUsernames();
    res.json(users.map((u) => u.username));
  } catch (err) {
    console.error("Users fetch failed:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
});

router.post("/follow", isAuthenticated, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Missing username" });
    if (username === req.user.username) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
    const target = await ventureDB.findUserByUsername(username);
    if (!target) return res.status(404).json({ message: "User not found" });

    await ventureDB.followUser(req.user.username, username);
    res.json({ message: "Followed" });
  } catch (err) {
    console.error("Follow failed:", err);
    res.status(500).json({ message: "Failed to follow" });
  }
});

router.post("/unfollow", isAuthenticated, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Missing username" });
    await ventureDB.unfollowUser(req.user.username, username);
    res.json({ message: "Unfollowed" });
  } catch (err) {
    console.error("Unfollow failed:", err);
    res.status(500).json({ message: "Failed to unfollow" });
  }
});

router.post("/remove-follower", isAuthenticated, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Missing username" });
    await ventureDB.unfollowUser(username, req.user.username);
    res.json({ message: "Follower removed" });
  } catch (err) {
    console.error("Remove follower failed:", err);
    res.status(500).json({ message: "Failed to remove follower" });
  }
});

export default router;