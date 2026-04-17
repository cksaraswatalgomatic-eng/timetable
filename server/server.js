require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// Middleware
// ============================================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Routes
// ============================================
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// Error Handling
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// ============================================
// Start Server
// ============================================
const startServer = async () => {
  // Test database connection
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('⚠️  Starting server without database connection');
    console.error('Please check your database configuration in .env file');
  }

  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║   TimeTable Pro API Server                    ║
╠═══════════════════════════════════════════════╣
║   Server running on port ${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'}${' '.repeat(Math.max(0, 28 - (process.env.NODE_ENV || 'development').length))}║
║   API: http://localhost:${PORT}/api           ║
╚═══════════════════════════════════════════════╝
    `);
  });
};

startServer();
