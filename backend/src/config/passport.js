import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (_, __, profile, done) => {
      try {
        let user = await User.findOne({
          email: profile.emails[0].value,
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: "google",
            providerId: profile.id,
            isOAuthUser: true,
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
