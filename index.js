const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running!' });
});

// Home endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Node.js GitHub Actions Demo!' });
});

// Add a simple utility function for testing
function greet(name) {
  return `Hello, ${name}!`;
}

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = { app, greet };