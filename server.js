const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const db = require('./config/db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const finesRoute = require('./routes/fines');
const violationEntryRoute = require('./routes/violation-entry');
const addFineRoute = require('./routes/add-fine');
const addOffenderRoute = require('./routes/add-offender');

app.use('/api/fines', finesRoute);
app.use('/api/violation-entry', violationEntryRoute);
app.use('/api/add-fine', addFineRoute);
app.use('/api/add-offender', addOffenderRoute);

// Serve index.html as homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚦 Server running on http://localhost:${PORT}`);
});
