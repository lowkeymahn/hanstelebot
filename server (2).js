const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware only
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from admin-dashboard directory
app.use('/admin', express.static(path.join(__dirname, 'admin-dashboard')));

// Simple login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({ 
      success: true, 
      token: 'admin-token-' + Date.now(),
      user: { username: 'admin', role: 'admin' }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Admin dashboard route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard', 'index.html'));
});

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Admin Dashboard running on port ${PORT}`);
  console.log(`📊 Access dashboard at: http://localhost:${PORT}/admin`);
  console.log(`🔑 Login: admin / admin123`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('💤 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('💤 Received SIGINT, shutting down gracefully');
  process.exit(0);
});