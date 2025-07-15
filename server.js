const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Minimal middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'admin-dashboard')));

// Login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'token123' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Admin route
app.get('/admin', (req, res) => {
  const indexPath = path.join(__dirname, 'admin-dashboard', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Dashboard</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .container { max-width: 400px; margin: 0 auto; }
          input { width: 100%; padding: 10px; margin: 5px 0; }
          button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; cursor: pointer; }
          button:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Admin Dashboard</h1>
          <form id="loginForm">
            <input type="text" id="username" placeholder="Username" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
          </form>
          <div id="result"></div>
        </div>
        <script>
          document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
              const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
              });
              
              const data = await response.json();
              
              if (data.success) {
                document.getElementById('result').innerHTML = '<h2>Login successful!</h2><p>Admin dashboard is working.</p>';
              } else {
                document.getElementById('result').innerHTML = '<p style="color: red;">Login failed</p>';
              }
            } catch (error) {
              document.getElementById('result').innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
            }
          });
        </script>
      </body>
      </html>
    `);
  }
});

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ' + PORT);
});
