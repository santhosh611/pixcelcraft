const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Patient = require('./models/Patient');

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

const nodemailer = require('nodemailer');

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/register-token', async (req, res) => {
  try {
    const { name, email, department, doctor, visitType, phone } = req.body;
    
    // Generating an ID and Token
    const tokenNumber = Math.floor(Math.random() * 90) + 10;
    const patientId = `VH-2026-001${Math.floor(Math.random() * 90) + 10}`;

    // Save to Database
    const newPatient = new Patient({
      patientId,
      name,
      email,
      phone,
      department,
      doctor,
      visitType,
      tokenNumber
    });
    await newPatient.save();

    if (email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Vetri Hospital - Registration & Token Details',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f766e;">Vetri Hospital</h2>
            <h3>Welcome to our network!</h3>
            <p>Dear <b>${name}</b>,</p>
            <p>You have been successfully registered. Your Patient ID is <b>${patientId}</b>.</p>
            <hr style="border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <h4 style="color: #334155;">Action Report: Visit Token Issued</h4>
            <ul style="list-style-type: none; padding: 0;">
              <li style="margin-bottom: 8px;"><b>Token Number:</b> <span style="font-size: 18px; color: #0f766e; font-weight: bold;">#${tokenNumber}</span></li>
              <li style="margin-bottom: 8px;"><b>Department:</b> ${department}</li>
              <li style="margin-bottom: 8px;"><b>Assigned Doctor:</b> ${doctor}</li>
              <li style="margin-bottom: 8px;"><b>Visit Type:</b> ${visitType}</li>
              <li style="margin-bottom: 8px;"><b>Registered Phone:</b> ${phone}</li>
            </ul>
            <p style="color: #64748b; font-size: 14px; margin-top: 30px;">Please take a seat in the waiting area. We will call your token number shortly.</p>
            <p style="color: #64748b; font-size: 14px;">Regards,<br/><b>Vetri Hospital Reception</b></p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Patient registered, token issued, and email sent.',
      data: { patientId, tokenNumber, name, department, doctor }
    });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ success: false, message: 'Failed to process request.' });
  }
});

// Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch patients.' });
  }
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

module.exports = app;
