import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/* =====================================
   🔥 USERNAME GENERATOR (UNIQUE + SAFE)
===================================== */
const generateUsername = async (name) => {

  let base = (name || "user")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  if (!base) base = "user";

  let username = base;
  let count = 1;

  while (await User.findOne({ name: username })) {
    username = `${base}${count}`;
    count++;
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
      scope: ["profile", "email"]
    },

    async (accessToken, refreshToken, profile, done) => {
      try {

        /* =====================================
           🧠 SAFE DATA EXTRACTION
        ===================================== */
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const displayName = profile.displayName || "";
        const avatar = profile.photos?.[0]?.value || "";

        if (!email) {
          return done(new Error("Google email not found"), null);
        }

        /* =====================================
           🔍 STEP 1: FIND BY GOOGLE ID
        ===================================== */
        let user = await User.findOne({ googleId });

        /* =====================================
           🔄 STEP 2: LINK EXISTING EMAIL USER
        ===================================== */
        if (!user) {
          const existingUser = await User.findOne({ email });

          if (existingUser) {

            existingUser.googleId = googleId;
            existingUser.avatar = avatar || existingUser.avatar;
            existingUser.authProvider = "google";
            existingUser.lastLogin = new Date();

            /* 🔥 FIX OLD INVALID USERNAME */
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

        /* =====================================
           ➕ STEP 3: CREATE NEW USER
        ===================================== */
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

        /* =====================================
           🔄 STEP 4: UPDATE LOGIN
        ===================================== */
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

        /* =====================================
           🔐 TOKEN GENERATE
        ===================================== */
        const token = generateToken({
          id: user._id,
          role: user.role
        });

        /* =====================================
           ✅ FINAL FIX (IMPORTANT)
        ===================================== */
        return done(null, {
          user,   // ✅ mongoose document
          token   // ✅ token separate
        });

      } catch (error) {
        console.error("❌ Google Auth Error:", error.message);
        return done(error, null);
      }
    }
  )
);

export default passport;