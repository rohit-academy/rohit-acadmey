import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/* 🔥 GOOGLE STRATEGY */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        /* 🧠 SAFE DATA EXTRACTION */
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const name = profile.displayName;
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
          user = await User.findOne({ email });

          if (user) {
            // 🔗 Link Google account with existing user
            user.googleId = googleId;
            user.avatar = avatar;
            user.authProvider = "google";
            await user.save();
          }
        }

        /* =====================================
           ➕ STEP 3: CREATE NEW USER
        ===================================== */
        if (!user) {
          user = await User.create({
            name,
            email,
            googleId,
            avatar,
            authProvider: "google",
            isVerified: true
          });
        }

        /* =====================================
           🔐 TOKEN GENERATE
        ===================================== */
        const token = generateToken(user._id);

        /* =====================================
           ✅ RETURN USER
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