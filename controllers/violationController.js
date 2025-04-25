const db = require('../config/db');

exports.getAllViolations = (req, res) => {
  const sql = 'SELECT * FROM Violations';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
