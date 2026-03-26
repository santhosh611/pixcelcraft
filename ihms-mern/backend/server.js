const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route for landing page/health check
app.get('/', (req, res) => {
  res.send('IHMS Backend is running');
});

// Dummy endpoint for stats (to show API consumption)
app.get('/api/stats', (req, res) => {
  res.json({
    opdToday: 84,
    opdChange: 12,
    bedsOccupied: 38,
    bedsTotal: 60,
    labPending: 12,
    revenue: "1.84L"
  });
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ihms_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    // Continue running server even if DB fails for development purposes
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without DB)`);
    });
  });
