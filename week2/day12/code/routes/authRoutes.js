const express = require("express");
const User = require("../models/User");
const {
  authService,
  authenticate,
} = require("../middleware/auth");
const { AppError } = require("../middleware/errorHandler");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Name, email and password are required", 400);
    }

    await authService.validatePassword(password);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError("Email is already registered", 409);
    }

    const hashedPassword = await authService.hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const tokens = await authService.generateTokens(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new AppError("Account is inactive", 403);
    }

    const passwordMatch = await authService.comparePassword(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    user.lastLogin = new Date();
    await user.save();

    const tokens = await authService.generateTokens(user);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    const decoded = await authService.verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new AppError("User not found or inactive", 401);
    }

    const tokens = await authService.generateTokens(user);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authenticate, async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
});


router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/change-password", authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError(
        "Current password and new password are required",
        400
      );
    }

    await authService.validatePassword(newPassword);

    const user = await User.findById(req.user.userId).select("+password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const passwordMatch = await authService.comparePassword(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      throw new AppError("Current password is incorrect", 401);
    }

    user.password = await authService.hashPassword(newPassword);
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/google",
  require("../middleware/oauth").authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  require("../middleware/oauth").authenticate("google", {
    session: false,
  }),
  (req, res) => {
    res.json({
      success: true,
      message: "Google authentication successful",
      user: req.user,
    });
  }
);

router.get(
  "/facebook",
  require("../middleware/oauth").authenticate("facebook", {
    scope: ["email"],
  })
);

router.get(
  "/facebook/callback",
  require("../middleware/oauth").authenticate("facebook", {
    session: false,
  }),
  (req, res) => {
    res.json({
      success: true,
      message: "Facebook authentication successful",
      user: req.user,
    });
  }
);

router.get(
  "/github",
  require("../middleware/oauth").authenticate("github", {
    scope: ["user:email"],
  })
);

router.get(
  "/github/callback",
  require("../middleware/oauth").authenticate("github", {
    session: false,
  }),
  (req, res) => {
    res.json({
      success: true,
      message: "GitHub authentication successful",
      user: req.user,
    });
  }
);

module.exports = router;