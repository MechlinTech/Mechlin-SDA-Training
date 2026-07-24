const User = require("../models/User");

const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashPassword,
    comparePassword,
    validatePassword,
  } = require("../middleware/auth");

const { AppError } = require("../middleware/errorHandler");

/**
 * ============================================================================
 * Authentication Service
 * ============================================================================
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * ✔ User Registration
 * ✔ User Login
 * ✔ Refresh Token
 * ✔ Password Management
 * ✔ Profile Management
 * ✔ Logout
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * Register User
 * ============================================================================
 */
const registerUser = async ({
  name,
  email,
  password,
  role = "user",
}) => {
  if (!validatePassword(password)) {
    throw new AppError(
      "Password must contain uppercase, lowercase, number and special character.",
      400
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already registered.", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    lastLogin: new Date(),
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const userResponse = user.toObject();
  delete userResponse.password;

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

/**
 * ============================================================================
 * Login User
 * ============================================================================
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    email,
    isActive: true,
  }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const passwordMatched = await comparePassword(
    password,
    user.password
  );

  if (!passwordMatched) {
    throw new AppError("Invalid email or password.", 401);
  }

  user.lastLogin = new Date();
  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const userResponse = user.toObject();
  delete userResponse.password;

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

/**
 * ============================================================================
 * Refresh Access Token
 * ============================================================================
 */
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required.", 400);
  }

  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    throw new AppError("Invalid refresh token.", 401);
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * ============================================================================
 * Get User Profile
 * ============================================================================
 *
 * Returns logged-in user's profile.
 *
 * ============================================================================
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

/**
 * ============================================================================
 * Change Password
 * ============================================================================
 *
 * Flow:
 *
 * Find User
 *      │
 * Verify Current Password
 *      │
 * Validate New Password
 *      │
 * Hash Password
 *      │
 * Save User
 *
 * ============================================================================
 */
const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const isCurrentPasswordCorrect = await comparePassword(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordCorrect) {
    throw new AppError("Current password is incorrect.", 400);
  }

  if (!validatePassword(newPassword)) {
    throw new AppError(
      "Password must contain uppercase, lowercase, number and special character.",
      400
    );
  }

  user.password = await hashPassword(newPassword);

  await user.save();

  return {
    success: true,
    message: "Password changed successfully.",
  };
};

/**
 * ============================================================================
 * Logout User
 * ============================================================================
 *
 * Stateless JWT authentication does not maintain sessions.
 *
 * In production:
 * - Store refresh tokens
 * - Blacklist revoked tokens
 * - Clear cookies
 *
 * ============================================================================
 */
const logoutUser = async () => {
  return {
    success: true,
    message: "Logged out successfully.",
  };
};

/**
 * ============================================================================
 * Module Exports
 * ============================================================================
 */

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  getUserProfile,
  changePassword,
  logoutUser,
};