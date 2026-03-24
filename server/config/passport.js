import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/* =====================================
   🔥 USERNAME GENERATOR (OPTIMIZED)
===================================== */
const generateUsername = async (name) => {

  let base = (name || "user")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  if (!base) base = "user";

  // 🔥 single query optimization
  const existingUsers = await User.find({
    name: new RegExp(`^${base}`)
  }).select("name");

  const usernames = existingUsers.map(u => u.name);

  if (!usernames.includes(base)) return base;

  let count = 1;
  let username = `${base}${count}`;

  while (usernames.includes(username)) {
    count++;
    username = `${base}${count}`;
  }

  return username;
};

/* =====================================
   🔥 GOOGLE STRATEGY
===================================== */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {

        /* 🧠 SAFE DATA */
        const email = profile.emails?.[0]?.value || null;
        const googleId = profile.id;
        const displayName = profile.displayName || "user";
        const avatar = profile.photos?.[0]?.value || "";

        if (!email) {
          return done(new Error("Google email not found"), null);
        }

        /* 🔍 FIND USER */
        let user = await User.findOne({ googleId });

        /* 🔄 LINK EXISTING */
        if (!user) {
          const existingUser = await User.findOne({ email });

          if (existingUser) {

            existingUser.googleId = googleId;
            existingUser.avatar = avatar || existingUser.avatar;
            existingUser.authProvider = "google";
            existingUser.lastLogin = new Date();

            if (
              !existingUser.name ||
              existingUser.name.includes(" ") ||
              /[^a-z0-9_]/.test(existingUser.name)
            ) {
              existingUser.name = await generateUsername(displayName);
            }

            user = await existingUser.save();
          }
        }

        /* ➕ CREATE NEW */
        if (!user) {

          const username = await generateUsername(displayName);

          user = await User.create({
            name: username,
            email,
            googleId,
            avatar,
            authProvider: "google",
            isVerified: true,
            lastLogin: new Date()
          });

        }

        /* 🔄 UPDATE */
        else {

          if (
            !user.name ||
            user.name.includes(" ") ||
            /[^a-z0-9_]/.test(user.name)
          ) {
            user.name = await generateUsername(displayName);
          }

          user.lastLogin = new Date();
          await user.save();
        }

        /* 🔐 TOKEN */
        const token = generateToken({
          id: user._id,
          role: user.role
        });

        /* ✅ SAFE RESPONSE */
        return done(null, {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            authProvider: user.authProvider
          },
          token
        });

      } catch (error) {
        console.error("❌ Google Auth Error:", error.message);
        return done(error, null);
      }
    }
  )
);

export default passport;