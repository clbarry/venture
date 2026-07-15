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

export default router;