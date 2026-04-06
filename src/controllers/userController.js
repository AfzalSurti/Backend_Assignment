const bcrypt = require("bcrypt");

const pool = require("../db");
const ROLES = require("../constants/roles");
const USER_STATUS = require("../constants/userStatus");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

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
        role || ROLES.VIEWER,
        status || USER_STATUS.ACTIVE,
      ]
    );

    return res.status(201).json({
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }

    return res.status(500).json({ message: "Failed to create user" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, email, role, status, created_at, updated_at
      FROM users
      ORDER BY created_at DESC, id DESC
      `
    );

    return res.status(200).json({
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT id, name, email, role, status, created_at, updated_at
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, status } = req.body;

    const existingUser = await pool.query(
      `
      SELECT id, name, email, role, status
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = existingUser.rows[0];

    const result = await pool.query(
      `
      UPDATE users
      SET name = $1,
          role = $2,
          status = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, name, email, role, status, created_at, updated_at
      `,
      [
        name ?? currentUser.name,
        role ?? currentUser.role,
        status ?? currentUser.status,
        id,
      ]
    );

    return res.status(200).json({
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user" });
  }
};
