import express from "express";
import ventureDB from "../db/ventureDB.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const itineraries = await ventureDB.getItineraries();

    // Show newest records first for feed ordering.
    itineraries.sort((a, b) => String(b._id).localeCompare(String(a._id)));

    const normalized = itineraries.map((itinerary) => {
      const likedBy = Array.isArray(itinerary.liked_by) ? itinerary.liked_by : [];
      return {
        ...itinerary,
        likes: Number(itinerary.likes) || 0,
        liked: likedBy.includes(req.user.username),
      };
    });

    res.json({ itineraries: normalized });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load feed" });
  }
});

router.post("/:itineraryId/like", isAuthenticated, async (req, res) => {
  try {
    const result = await ventureDB.toggleItineraryLike(
      req.params.itineraryId,
      req.user.username,
    );

    if (result === null) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    return res.json({ success: true, likes: result.likes, liked: result.liked });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to like itinerary" });
  }
});

export default router;