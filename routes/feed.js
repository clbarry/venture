import express from "express";
import ventureDB from "../db/ventureDB.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, async (_req, res) => {
  try {
    const itineraries = await ventureDB.getItineraries();

    // Show newest records first for feed ordering.
    itineraries.sort((a, b) => String(b._id).localeCompare(String(a._id)));

    res.json({ itineraries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load feed" });
  }
});

export default router;