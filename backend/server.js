require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(express.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // optional but recommended for preflight

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Local only
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Vercel serverless export
module.exports = app;
