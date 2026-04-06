const pool = require("../db");

exports.createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO records (user_id, amount, type, category, date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, amount, type, category, date, notes, created_at, updated_at`,
      [req.user.id, amount, type, category, date, notes || null]
    );

    return res.status(201).json({
      message: "Record created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create record" });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    const conditions = [];
    const values = [];

    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    if (startDate) {
      values.push(startDate);
      conditions.push(`date >= $${values.length}`);
    }

    if (endDate) {
      values.push(endDate);
      conditions.push(`date <= $${values.length}`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const result = await pool.query(
      `SELECT id, user_id, amount, type, category, date, notes, created_at, updated_at
       FROM records
       ${whereClause}
       ORDER BY date DESC, id DESC`,
      values
    );

    return res.status(200).json({
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch records" });
  }
};

exports.getRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, user_id, amount, type, category, date, notes, created_at, updated_at
       FROM records
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch record" });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, date, notes } = req.body;

    const existingRecord = await pool.query(
      `SELECT amount, type, category, date, notes
       FROM records
       WHERE id = $1`,
      [id]
    );

    if (existingRecord.rows.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    const currentRecord = existingRecord.rows[0];

    const result = await pool.query(
      `UPDATE records
       SET amount = $1,
           type = $2,
           category = $3,
           date = $4,
           notes = $5,
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, user_id, amount, type, category, date, notes, created_at, updated_at`,
      [
        amount ?? currentRecord.amount,
        type ?? currentRecord.type,
        category ?? currentRecord.category,
        date ?? currentRecord.date,
        notes !== undefined ? notes : currentRecord.notes,
        id,
      ]
    );

    return res.status(200).json({
      message: "Record updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update record" });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM records
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete record" });
  }
};
