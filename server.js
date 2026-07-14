import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import passport from "./config/passport.js";
import authRouter from "./routes/auth.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3300;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/", express.static(path.join(__dirname, "./frontend/dist")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.static("../frontend/dist"));

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
