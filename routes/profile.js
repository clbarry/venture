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

export default router;