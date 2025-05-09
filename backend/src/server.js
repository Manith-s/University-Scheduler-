const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
/*
async function setupTestEmailAccount() {
  // Create a test account at Ethereal
  const testAccount = await nodemailer.createTestAccount();
  
  console.log('Test email account created:');
  console.log('- Email:', testAccount.user);
  console.log('- Password:', testAccount.pass);
  console.log('- SMTP Host:', testAccount.smtp.host);
  console.log('- SMTP Port:', testAccount.smtp.port);
  
  // Update environment variables
  process.env.EMAIL_HOST = testAccount.smtp.host;
  process.env.EMAIL_PORT = testAccount.smtp.port;
  process.env.EMAIL_SECURE = testAccount.smtp.secure;
  process.env.EMAIL_USER = testAccount.user;
  process.env.EMAIL_PASS = testAccount.pass;
  
  console.log('Test email account configured successfully!');
}

// Call this function when the server starts in development mode
if (process.env.NODE_ENV !== 'production') {
  setupTestEmailAccount()
    .catch(console.error);
}
*/

// Create Express app FIRST, before using it
const app = express();

// Near the top of server.js after creating the app
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

const { testConnection } = require('./config/database');
const departmentRoutes = require('./routes/departmentRoutes');
const testRoutes = require('./routes/test');
// Near the top with your other requires
const tempAuthRoutes = require('./routes/tempAuth');
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
testConnection();

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the University Course Scheduling API' });
});

// Routes
app.use('/api/departments', departmentRoutes);
//app.use('/api/departments', require('./routes/departmentRoutes'));
// In server.js, add this line:
app.use('/api/professors', require('./routes/professorRoutes'));
// In server.js, update the line:
app.use('/api', require('./routes/professorAvailabilityRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/timeslots', require('./routes/timeSlotRoutes'));
//app.use('/api/time-slots', require('./routes/timeSlotRoutes'));
app.use('/api/semesters', require('./routes/semesterRoutes'));
app.use('/api/schedules', require('./routes/scheduleRoutes'));
app.use('/api/scheduled-courses', require('./routes/scheduledCourseRoutes'));
app.use('/api/scheduler', require('./routes/schedulerRoutes'));
//app.use('/api/conflicts', require('./routes/conflictRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/scheduledCourseRoutes'));

// With your other app.use statements
app.use('/api/auth', tempAuthRoutes);
app.use('/api/test', testRoutes);
//app.use('/api/auth', tempAuthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error in request:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ 
    message: 'An unexpected error occurred', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});
const { initializeTransporter } = require('./services/emailService');

// Initialize email service
try {
  console.log('Initializing email service...');
  // Just reference the already-initialized email service
  const emailService = require('./services/emailService');
  console.log('Email service initialization referenced successfully');
} catch (error) {
  console.error('Failed to reference email service:', error);
}
module.exports = app;