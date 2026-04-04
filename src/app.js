const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running...");
});


app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.use("/api/auth", authRoutes);


module.exports = app;