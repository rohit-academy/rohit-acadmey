import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/* =====================================
   🔥 USERNAME GENERATOR (UNIQUE)
===================================== */
const generateUsername = async (name) => {

  let base = (name || "user")
    .toLowerCase()
    .replace(/\s+/g, "_")          // spaces → _
    .replace(/[^a-z0-9_]/g, "");   // remove invalid chars

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
           🧠 SAFE DATA
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

            user = await existingUser.save();
          }
        }

        /* =====================================
           ➕ STEP 3: CREATE NEW USER (🔥 AUTO USERNAME)
        ===================================== */
        if (!user) {

          const username = await generateUsername(displayName);

          user = await User.create({
            name: username, // 🔥 AUTO GENERATED UNIQUE USERNAME
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
          user.lastLogin = new Date();
          await user.save();
        }

        /* =====================================
           🔐 TOKEN
        ===================================== */
        const token = generateToken({
          id: user._id,
          role: user.role
        });

        /* =====================================
           ✅ RETURN
        ===================================== */
        return done(null, {
          ...user.toObject(),
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