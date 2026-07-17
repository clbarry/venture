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

router.post("/create", isAuthenticated, async (req, res) => {
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
  } = req.body;

  if (!title || !theme || !fitnessLevel || !dayCount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const daysList = normalizeDayEntries(days);
  const plan = {};

  daysList.forEach((day, index) => {
    const activities = Array.isArray(day?.activities)
      ? day.activities.map((v) => String(v).trim()).filter(Boolean)
      : [];
    plan[`day_${index + 1}`] = activities;
  });

  // Ensure plan has keys up to selected day count even when some days have no activities yet.
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

  const record = {
    title: String(title).trim(),
    caption: String(caption || "").trim() || String(title).trim(),
    creator: req.user.username,
    theme: String(theme).trim(),
    fitness_level: String(fitnessLevel).trim(),
    country: String(country || "").trim(),
    city: String(cityRegion || "").trim(),
    collaborators: collaboratorList,
    family_friendly: Boolean(familyFriendly),
    day_count: selectedDayCount,
    plan,
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

export default router;
