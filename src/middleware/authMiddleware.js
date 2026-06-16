const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createHttpError } = require("../utils/httpError");

async function protect(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next(createHttpError(401, "Not authorized. Please log in."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(createHttpError(401, "User account no longer exists."));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(createHttpError(401, "Session is invalid or has expired."));
  }
}

module.exports = { protect };
