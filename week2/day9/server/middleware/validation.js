const { validationResult } = require("express-validator");
const { AppError } = require("./errorHandler");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }
  next();
};

module.exports = { handleValidation };