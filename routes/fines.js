const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  const { reg, phone } = req.query;

  let sql = `
    SELECT f.*
    FROM Fines f
    JOIN Violations v ON f.Violation_ID = v.Violation_ID
    JOIN Vehicles ve ON v.Vehicle_ID = ve.Vehicle_ID
    JOIN Offenders o ON v.Offender_ID = o.Offender_ID
    WHERE 1=1
  `;

  const params = [];

  if (reg) {
    sql += " AND TRIM(UPPER(ve.Registration_Number)) = TRIM(UPPER(?))";
    params.push(reg);
  }

  if (phone) {
    sql += " AND o.Contact_Number = ?";
    params.push(phone);
  }

  // Debug logging
  console.log('Executing SQL:', sql);
  console.log('With params:', params);

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('Results found:', results.length);
    if (results.length === 0 && reg) {
      // Debug: Show all vehicles, violations, and fines for this reg
      db.query("SELECT * FROM Vehicles WHERE TRIM(UPPER(Registration_Number)) = TRIM(UPPER(?))", [reg], (vehErr, vehRes) => {
        if (vehErr) {
          console.error('Vehicle check error:', vehErr);
          return res.status(500).json({ error: vehErr.message });
        }
        console.log('Vehicles found:', vehRes);
        if (vehRes.length === 0) {
          return res.status(404).json({ message: 'Vehicle not found in database.' });
        } else {
          const vehicleId = vehRes[0].Vehicle_ID;
          db.query("SELECT * FROM Violations WHERE Vehicle_ID = ?", [vehicleId], (vioErr, vioRes) => {
            if (vioErr) {
              console.error('Violation check error:', vioErr);
              return res.status(500).json({ error: vioErr.message });
            }
            console.log('Violations found:', vioRes);
            if (vioRes.length === 0) {
              return res.status(200).json({ message: 'Vehicle found, but no violations or fines linked to this vehicle.' });
            } else {
              // Show all fines for these violations
              const violationIds = vioRes.map(v => v.Violation_ID);
              if (violationIds.length === 0) {
                return res.status(200).json({ message: 'Vehicle found and has violations, but no fines linked to this vehicle.' });
              }
              db.query(`SELECT * FROM Fines WHERE Violation_ID IN (${violationIds.map(() => '?').join(',')})`, violationIds, (fineErr, fineRes) => {
                if (fineErr) {
                  console.error('Fine check error:', fineErr);
                  return res.status(500).json({ error: fineErr.message });
                }
                console.log('Fines found for these violations:', fineRes);
                if (fineRes.length === 0) {
                  return res.status(200).json({ message: 'Vehicle found and has violations, but no fines linked to this vehicle.' });
                } else {
                  // This should not happen, but return the fines if found
                  return res.json(fineRes);
                }
              });
            }
          });
        }
      });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
