/**
 * ============================================================================
 * OAuth Middleware
 * ============================================================================
 *
 * Responsibilities:
 * - Validate OAuth user information
 * - Prepare OAuth profile for application
 * - Support future providers
 *
 * Supported Providers (Future):
 * - Google
 * - GitHub
 * - Facebook
 * - Microsoft
 *
 * NOTE:
 * This project currently uses JWT Authentication.
 * OAuth providers can be integrated later using Passport.js.
 *
 * ============================================================================
 */

const { AppError } = require("./errorHandler");

/**
 * ============================================================================
 * Validate OAuth Provider
 * ============================================================================
 */

const validateOAuthProvider = (provider) => {
  const supportedProviders = [
    "google",
    "github",
    "facebook",
    "microsoft",
  ];

  return supportedProviders.includes(provider);
};

/**
 * ============================================================================
 * OAuth Middleware
 * ============================================================================
 */

const oauth = (provider) => {
  return (req, res, next) => {
    if (!validateOAuthProvider(provider)) {
      return next(
        new AppError(
          `OAuth provider '${provider}' is not supported.`,
          400
        )
      );
    }

    req.oauth = {
      provider,
      authenticated: false,
    };

    next();
  };
};

/**
 * ============================================================================
 * Format OAuth Profile
 * ============================================================================
 */

const formatOAuthProfile = (profile, provider) => {
  if (!profile) {
    throw new AppError("OAuth profile not found.", 400);
  }

  return {
    provider,

    providerId: profile.id,

    name:
      profile.displayName ||
      profile.name ||
      "",

    email:
      profile.email ||
      (profile.emails && profile.emails[0]?.value) ||
      "",

    avatar:
      profile.picture ||
      profile.photos?.[0]?.value ||
      "",

    rawProfile: profile,
  };
};

/**
 * ============================================================================
 * Exports
 * ============================================================================
 */

module.exports = {
  oauth,
  validateOAuthProvider,
  formatOAuthProfile,
};