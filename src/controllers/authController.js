const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *",
    [name, email, hashedPassword]
  );

  res.json(result.rows[0]);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (user.rows.length === 0)
    return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.rows[0].password);

  if (!valid)
    return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user.rows[0].id, role: user.rows[0].role },
    process.env.JWT_SECRET
  );

  res.json({ token });
};