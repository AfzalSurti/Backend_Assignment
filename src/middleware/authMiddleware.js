const jwt = require("jsonwebtoken");
const pool = require("../db");
const USER_STATUS = require("../constants/userStatus");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization token missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userResult = await pool.query(
      `
      SELECT id, name, email, role, status
      FROM users
      WHERE id = $1
      `,
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    if (userResult.rows[0].status !== USER_STATUS.ACTIVE) {
      return res.status(403).json({ message: "User account is inactive" });
    }

    req.user = userResult.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
