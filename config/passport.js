import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getDB } from "./db.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await getDB().collection("users").findOne({ email });
        if (!user)
          return done(null, false, { message: "Invalid email or password" });
        const match = await bcrypt.compare(password, user.password);
        if (!match)
          return done(null, false, { message: "Invalid email or password" });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user._id.toString()));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getDB()
      .collection("users")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
