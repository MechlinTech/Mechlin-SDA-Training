const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { AppError } = require("./errorHandler");

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
    this.refreshTokenExpiresIn =
      process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";
  }

  async generateTokens(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: "sda-training-api",
      audience: "sda-training-client",
    });

    const refreshToken = jwt.sign(
      {
        userId: user._id,
        type: "refresh",
      },
      this.jwtSecret,
      {
        expiresIn: this.refreshTokenExpiresIn,
      }
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret, {
        issuer: "sda-training-api",
        audience: "sda-training-client",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError("Token expired", 401);
      }

      if (error.name === "JsonWebTokenError") {
        throw new AppError("Invalid token", 401);
      }

      throw error;
    }
  }

  async verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);

      if (decoded.type !== "refresh") {
        throw new AppError("Invalid refresh token", 401);
      }

      return decoded;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error.name === "TokenExpiredError") {
        throw new AppError("Refresh token expired", 401);
      }

      if (error.name === "JsonWebTokenError") {
        throw new AppError("Invalid refresh token", 401);
      }

      throw error;
    }
  }

  async hashPassword(password) {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  async validatePassword(password) {
    if (!password) {
      throw new AppError("Password is required", 400);
    }

    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push(
        "Password must contain at least one uppercase letter"
      );
    }

    if (!/[a-z]/.test(password)) {
      errors.push(
        "Password must contain at least one lowercase letter"
      );
    }

    if (!/\d/.test(password)) {
      errors.push(
        "Password must contain at least one number"
      );
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push(
        "Password must contain at least one special character"
      );
    }

    if (errors.length > 0) {
      throw new AppError(
        "Password validation failed",
        400,
        errors
      );
    }

    return true;
  }
}

const authService = new AuthService();

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access token is required", 401);
    }

    const token = authHeader.substring(7);

    const decoded = await authService.verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError("Authentication required", 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Insufficient permissions", 403)
      );
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      const decoded = await authService.verifyToken(token);

      req.user = decoded;
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authService,
  authenticate,
  authorize,
  optionalAuth,
};