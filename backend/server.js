import express from "express";
import session from "express-session";
import dotenv from "dotenv";
// import passport from "./config/passport.js";
// import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3300;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(passport.initialize());
// app.use(passport.session());

app.use("/", express.static("../frontend/dist"));

// app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
