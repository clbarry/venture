import express from "express";
import bcrypt from "bcrypt";
import passport from "../config/passport.js";
import ventureDB from "../db/ventureDB.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existing = await ventureDB.findUserByUsername(username);
    if (existing) {
      return res.status(409).json({ message: "Username taken" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await ventureDB.createUser({
      username,
      email,
      password: hash,
      followers: [],
      following: [],
    });
    delete user.password;
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login failed" });
      res.status(201).json({ message: "Register successful", user });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Register failed" });
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Login successful", user: req.user });
});

router.get("/user", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logout successful" });
  });
});

export default router;