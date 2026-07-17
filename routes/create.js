/* https://expressjs.com/en/5x/guide/routing/ */

import express from "express";
import ventureDB from "../db/ventureDB.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

function normalizeDayEntries(daysRaw) {
  if (!daysRaw) return [];
  if (Array.isArray(daysRaw)) return daysRaw;
  if (typeof daysRaw === "object") return Object.values(daysRaw);
  return [];
}

function buildItineraryPayload(body) {
  const {
    title,
    caption,
    theme,
    fitnessLevel,
    country,
    cityRegion,
    dayCount,
    familyFriendly,
    collaborators,
    days,
  } = body;

  if (!title || !theme || !fitnessLevel || !dayCount) {
    return { error: "Missing required fields" };
  }

  const daysList = normalizeDayEntries(days);
  const plan = {};

  daysList.forEach((day, index) => {
    const activities = Array.isArray(day?.activities)
      ? day.activities.map((v) => String(v).trim()).filter(Boolean)
      : [];
    plan[`day_${index + 1}`] = activities;
  });

  const selectedDayCount = Number(dayCount) || 0;
  for (let i = 1; i <= selectedDayCount; i += 1) {
    const key = `day_${i}`;
    if (!Object.hasOwn(plan, key)) {
      plan[key] = [];
    }
  }

  const collaboratorList = String(collaborators || "")
    .split(",")
    .map((value) => value.trim().replace(/^@+/, ""))
    .filter(Boolean);

  return {
    payload: {
      title: String(title).trim(),
      caption: String(caption || "").trim() || String(title).trim(),
      theme: String(theme).trim(),
      fitness_level: String(fitnessLevel).trim(),
      country: String(country || "").trim(),
      city: String(cityRegion || "").trim(),
      collaborators: collaboratorList,
      family_friendly: Boolean(familyFriendly),
      day_count: selectedDayCount,
      plan,
    },
  };
}

router.get("/create/editable", isAuthenticated, async (req, res) => {
  try {
    const itineraries = await ventureDB.getEditableItinerariesForUser(req.user.username);
    return res.json({ itineraries });
  } catch (error) {
    console.error("Load editable itineraries failed:", error);
    return res.status(500).json({ error: "Could not load editable itineraries" });
  }
});

router.get("/create/:itineraryId", isAuthenticated, async (req, res) => {
  try {
    const itinerary = await ventureDB.getEditableItineraryById(
      req.params.itineraryId,
      req.user.username,
    );

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    return res.json({ itinerary });
  } catch (error) {
    console.error("Load itinerary for edit failed:", error);
    return res.status(500).json({ error: "Could not load itinerary" });
  }
});

router.post("/create", isAuthenticated, async (req, res) => {
  const built = buildItineraryPayload(req.body);
  if (built.error) {
    return res.status(400).json({ error: built.error });
  }

  const record = {
    ...built.payload,
    creator: req.user.username,
    likes: 0,
    liked_by: [],
    created_at: new Date(),
  };

  try {
    const result = await ventureDB.createItinerary(record);

    const acceptsHtml = (req.headers.accept || "").includes("text/html");
    if (acceptsHtml) {
      return res.redirect("/feed");
    }

    return res.status(201).json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Create failed:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/create/:itineraryId", isAuthenticated, async (req, res) => {
  const built = buildItineraryPayload(req.body);
  if (built.error) {
    return res.status(400).json({ error: built.error });
  }

  try {
    const result = await ventureDB.updateEditableItineraryById(
      req.params.itineraryId,
      req.user.username,
      built.payload,
    );

    if (result.reason === "not found") {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    if (result.reason === "forbidden") {
      return res.status(403).json({ error: "You cannot edit this itinerary" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Update itinerary failed:", error);
    return res.status(500).json({ error: "Could not update itinerary" });
  }
});

export default router;
