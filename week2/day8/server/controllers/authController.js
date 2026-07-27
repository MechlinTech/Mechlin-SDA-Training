const authService = require("../services/authService");

/**
 * ==========================================================
 * Register User
 * ==========================================================
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ==========================================================
 * Login User
 * ==========================================================
 */
const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ==========================================================
 * Refresh Token
 * ==========================================================
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Access token refreshed.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ==========================================================
 * Get Profile
 * ==========================================================
 */
const profile = async (req, res, next) => {
  try {
    const result = await authService.getUserProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ==========================================================
 * Change Password
 * ==========================================================
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const result = await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ==========================================================
 * Logout
 * ==========================================================
 */
const logout = async (req, res, next) => {
  try {
    const result = await authService.logoutUser();

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  profile,
  changePassword,
  logout,
};