const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', (req, res) => {
  const { name, license, address, contact, fineAmount } = req.body;
  if (!name || !license || !address || !contact || !fineAmount || isNaN(fineAmount) || Number(fineAmount) <= 0) {
    return res.json({ success: false, message: 'All fields are required and fine amount must be valid.' });
  }
  db.query(
    'INSERT INTO Offenders (Name, License_Number, Address, Contact_Number) VALUES (?, ?, ?, ?)',
    [name, license, address, contact],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.json({ success: false, message: 'License number already exists.' });
        }
        return res.json({ success: false, message: 'Database error.' });
      }
      const offenderId = result.insertId;
      // Insert a dummy vehicle for the offender
      const regNum = 'REG' + Date.now();
      db.query(
        'INSERT INTO Vehicles (Registration_Number, Owner_Name, Vehicle_type, Model, Color, Offender_ID) VALUES (?, ?, ?, ?, ?, ?)',
        [regNum, name, 'Unknown', 'Unknown', 'Unknown', offenderId],
        (vehErr, vehRes) => {
          if (vehErr) return res.json({ success: false, message: 'Error creating vehicle.' });
          const vehicleId = vehRes.insertId;
          // Insert a violation
          db.query(
            'INSERT INTO Violations (Offender_ID, Vehicle_ID, Violation_Type, Violation_Date, Location, Penalty_Amount, Officer_ID) VALUES (?, ?, ?, CURDATE(), ?, ?, ?)',
            [offenderId, vehicleId, 'Manual Entry', 'Unknown', fineAmount, 1],
            (vioErr, vioRes) => {
              if (vioErr) return res.json({ success: false, message: 'Error creating violation.' });
              const violationId = vioRes.insertId;
              // Insert a fine
              db.query(
                'INSERT INTO Fines (Violation_ID, Offender_ID, Amount, Due_Date, Payment_Status, Late_Fee) VALUES (?, ?, ?, DATE_ADD(CURDATE(), INTERVAL 15 DAY), ?, ?)',
                [violationId, offenderId, fineAmount, 'Unpaid', 0],
                (fineErr, fineRes) => {
                  if (fineErr) return res.json({ success: false, message: 'Error creating fine.' });
                  res.json({ success: true });
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;
