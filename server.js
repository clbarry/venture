import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import passport from "./config/passport.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3300;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.use("/", express.static(path.join(__dirname, "frontend/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});