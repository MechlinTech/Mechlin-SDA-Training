const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.findOne({
              email: profile.emails?.[0]?.value,
            });

            if (user) {
              user.googleId = profile.id;
              await user.save();
            } else {
              user = await User.create({
                name: profile.displayName,
                email: profile.emails?.[0]?.value,
                googleId: profile.id,
                avatar: profile.photos?.[0]?.value,
              });
            }
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// Facebook OAuth
if (
  process.env.FACEBOOK_APP_ID &&
  process.env.FACEBOOK_APP_SECRET
) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: ["id", "displayName", "emails", "photos"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ facebookId: profile.id });

          if (!user) {
            const email = profile.emails?.[0]?.value;

            user = email
              ? await User.findOne({ email })
              : null;

            if (user) {
              user.facebookId = profile.id;
              await user.save();
            } else {
              user = await User.create({
                name: profile.displayName,
                email: email || `${profile.id}@facebook.local`,
                facebookId: profile.id,
                avatar: profile.photos?.[0]?.value,
              });
            }
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// GitHub OAuth
if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET
) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
            const email =
              profile.emails?.[0]?.value ||
              `${profile.username}@github.local`;

            user = await User.findOne({ email });

            if (user) {
              user.githubId = profile.id;
              await user.save();
            } else {
              user = await User.create({
                name: profile.displayName || profile.username,
                email,
                githubId: profile.id,
                avatar: profile.photos?.[0]?.value,
              });
            }
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

module.exports = passport;