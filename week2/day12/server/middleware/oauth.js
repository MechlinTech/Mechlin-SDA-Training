const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// GOOGLE
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos?.[0]?.value,
          role: 'user',
          isActive: true
        });
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

// FACEBOOK
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/v1/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'picture']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        user = await User.create({
          facebookId: profile.id,
          name: `${profile.name.givenName} ${profile.name.familyName}`,
          email: profile.emails[0].value,
          avatar: profile.photos?.[0]?.value,
          role: 'user',
          isActive: true
        });
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

// GITHUB
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/github/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails?.[0]?.value });

      if (!user) {
        user = await User.create({
          githubId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value,
          role: 'user',
          isActive: true
        });
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;