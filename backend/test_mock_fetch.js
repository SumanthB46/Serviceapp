const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });
const token = jwt.sign({ id: '654321098765432109876543', role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
fetch('http://localhost:5005/api/reports/dashboard', { headers: { Authorization: "Bearer " + token } })
  .then(r => r.text())
  .then(console.log);
