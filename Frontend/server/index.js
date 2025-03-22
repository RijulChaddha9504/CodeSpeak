const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

require

require('dotenv').config();

// API routes
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

// Serve the Vite build output
// app.use(express.static(path.join(__dirname, '../dist')));

// Handle all other routes by serving index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});