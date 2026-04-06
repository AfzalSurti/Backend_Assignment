const pool = require("../db");

exports.getSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
        COALESCE(
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) -
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),
          0
        ) AS net_balance,
        COUNT(*) AS total_records
      FROM records
    `);

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch dashboard summary" });
  }
};

exports.getCategoryBreakdown = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        category,
        type,
        COUNT(*) AS record_count,
        COALESCE(SUM(amount), 0) AS total_amount
      FROM records
      GROUP BY category, type
      ORDER BY total_amount DESC, category ASC
    `);

    return res.status(200).json({
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch category breakdown" });
  }
};

exports.getTrends = async (req, res) => {
  try {
    const requestedPeriod = req.query.period === "weekly" ? "week" : "month";

    const result = await pool.query(
      `
      SELECT
        DATE_TRUNC($1, date)::date AS period_start,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
        COALESCE(
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) -
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),
          0
        ) AS net_balance
      FROM records
      GROUP BY DATE_TRUNC($1, date)
      ORDER BY period_start DESC
      `,
      [requestedPeriod]
    );

    return res.status(200).json({
      period: requestedPeriod,
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch trend data" });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 5);

    const result = await pool.query(
      `
      SELECT id, user_id, amount, type, category, date, notes, created_at, updated_at
      FROM records
      ORDER BY date DESC, created_at DESC, id DESC
      LIMIT $1
      `,
      [limit]
    );

    return res.status(200).json({
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch recent activity" });
  }
};
