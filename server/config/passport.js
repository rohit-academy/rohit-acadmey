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

      /* 🔥 IMPORTANT FIX */
      callbackURL: process.env.GOOGLE_CALLBACK_URL,

      scope: ["profile", "email"]
    },

    async (accessToken, refreshToken, profile, done) => {
      try {

        /* 🧠 SAFE EMAIL EXTRACTION */
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google email not found"), null);
        }

        /* 🔍 CHECK USER */
        let user = await User.findOne({ email });

        /* ➕ CREATE USER */
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            avatar: profile.photos?.[0]?.value || "",
            isVerified: true   // ✅ Google users auto verified
          });
        }

        /* 🔐 TOKEN */
        const token = generateToken(user._id);

        /* ✅ SEND USER + TOKEN */
        return done(null, {
          ...user.toObject(),
          token
        });

      } catch (error) {
        console.error("Google Auth Error:", error.message);
        return done(error, null);
      }
    }
  )
);

export default passport;