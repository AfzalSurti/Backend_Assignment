const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ROLES = require("../constants/roles");
const USER_STATUS = require("../constants/userStatus");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (name, email, password, role, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, status, created_at, updated_at
      `,
      [
        name,
        email.toLowerCase(),
        hashedPassword,
        ROLES.VIEWER,
        USER_STATUS.ACTIVE,
      ]
    );

    return res.status(201).json({
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }

    return res.status(500).json({ message: "Failed to register user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT id, name, email, password, role, status FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.rows[0].status !== USER_STATUS.ACTIVE) {
      return res.status(403).json({ message: "User account is inactive" });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password);

    if (!valid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
        status: user.rows[0].status,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login" });
  }
};
