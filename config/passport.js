import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import ventureDB from "../db/ventureDB.js";

const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await ventureDB.findUserByUsername(username);
    if (!user) {
      return done(null, false, { message: "User or password incorrect" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return done(null, false, { message: "User or password incorrect" });
    }
    delete user.password;
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await ventureDB.findUserById(id);
    if (user) delete user.password;
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;