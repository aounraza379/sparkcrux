const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"]
    }
  }
}));

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// CORS for API routes
app.use('/api', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 3600000, // 1 hour
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 3, // 3 requests per window
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api', limiter);

// Database setup
const dbPath = process.env.DATABASE_PATH || './database/sparkcrux.db';
const dbDir = path.dirname(dbPath);

// Create database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// Initialize database tables
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Contact submissions table
      db.run(`CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        website TEXT,
        service TEXT NOT NULL,
        budget TEXT,
        message TEXT NOT NULL,
        source TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) reject(err);
      });

      // Audit requests table
      db.run(`CREATE TABLE IF NOT EXISTS audit_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        website_url TEXT NOT NULL,
        audit_type TEXT NOT NULL,
        goal TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

// Input sanitization and validation
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

function validateContactSubmission(data) {
  const errors = [];
  
  if (!data.name || !data.name.trim()) {
    errors.push('Name is required');
  } else if (data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (!data.email || !data.email.trim()) {
    errors.push('Email is required');
  } else if (!validator.isEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.service || !data.service.trim()) {
    errors.push('Service selection is required');
  }
  
  if (!data.message || !data.message.trim()) {
    errors.push('Message is required');
  } else if (data.message.length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }
  
  if (data.website && data.website.trim() && !validator.isURL(data.website)) {
    errors.push('Please enter a valid website URL');
  }
  
  return errors;
}

function validateAuditRequest(data) {
  const errors = [];
  
  if (!data.name || !data.name.trim()) {
    errors.push('Name is required');
  } else if (data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (!data.email || !data.email.trim()) {
    errors.push('Email is required');
  } else if (!validator.isEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.website_url || !data.website_url.trim()) {
    errors.push('Website URL is required');
  } else if (!validator.isURL(data.website_url)) {
    errors.push('Please enter a valid website URL');
  }
  
  if (!data.audit_type || !data.audit_type.trim()) {
    errors.push('Audit type is required');
  } else if (!['seo', 'website', 'social'].includes(data.audit_type)) {
    errors.push('Invalid audit type');
  }
  
  return errors;
}

// API Routes

// POST /api/contact - Handle contact form submissions
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, website, service, budget, message, source } = req.body;
    
    // Validate input
    const errors = validateContactSubmission({ name, email, website, service, budget, message, source });
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    // Sanitize input
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      website: sanitizeInput(website),
      service: sanitizeInput(service),
      budget: sanitizeInput(budget),
      message: sanitizeInput(message),
      source: sanitizeInput(source),
      ip_address: req.ip || req.connection.remoteAddress
    };
    
    // Save to database
    db.run(
      `INSERT INTO contact_submissions (name, email, website, service, budget, message, source, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [sanitizedData.name, sanitizedData.email, sanitizedData.website, sanitizedData.service, 
       sanitizedData.budget, sanitizedData.message, sanitizedData.source, sanitizedData.ip_address],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to save submission' });
        }
        
        res.json({ success: true, message: 'Contact form submitted successfully' });
      }
    );
    
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/audit - Handle audit form submissions
app.post('/api/audit', async (req, res) => {
  try {
    const { name, email, website_url, audit_type, goal } = req.body;
    
    // Validate input
    const errors = validateAuditRequest({ name, email, website_url, audit_type, goal });
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    // Sanitize input
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      website_url: sanitizeInput(website_url),
      audit_type: sanitizeInput(audit_type),
      goal: sanitizeInput(goal),
      ip_address: req.ip || req.connection.remoteAddress
    };
    
    // Save to database
    db.run(
      `INSERT INTO audit_requests (name, email, website_url, audit_type, goal, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sanitizedData.name, sanitizedData.email, sanitizedData.website_url, 
       sanitizedData.audit_type, sanitizedData.goal, sanitizedData.ip_address],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to save audit request' });
        }
        
        res.json({ success: true, message: 'Audit request submitted successfully' });
      }
    );
    
  } catch (error) {
    console.error('Audit submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin panel
app.get('/admin', (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    return res.status(500).send('Admin password not configured');
  }
  
  // Simple password protection via query param (for demo)
  // In production, use proper session-based authentication
  const providedPassword = req.query.password;
  
  if (providedPassword !== adminPassword) {
    return res.status(401).send(`
      <html>
        <head><title>Admin Login - SparkCrux</title></head>
        <body style="font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px;">
          <h1>Admin Login</h1>
          <form method="get">
            <input type="password" name="password" placeholder="Enter admin password" required style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px;">
            <button type="submit" style="background: #FF5C00; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Login</button>
          </form>
        </body>
      </html>
    `);
  }
  
  // Fetch submissions
  db.all('SELECT * FROM contact_submissions ORDER BY created_at DESC', (err, contactSubmissions) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    
    db.all('SELECT * FROM audit_requests ORDER BY created_at DESC', (err, auditRequests) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      
      // Render admin dashboard
      res.send(`
        <html>
          <head>
            <title>Admin Dashboard - SparkCrux</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
              .container { max-width: 1200px; margin: 0 auto; }
              h1, h2 { color: #333; }
              .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background: #f8f9fa; font-weight: bold; }
              tr:hover { background: #f8f9fa; }
              .meta { color: #666; font-size: 0.9em; }
              .badge { background: #FF5C00; color: white; padding: 2px 6px; border-radius: 3px; font-size: 0.8em; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>SparkCrux Admin Dashboard</h1>
              
              <div class="section">
                <h2>Contact Submissions (${contactSubmissions.length})</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Service</th>
                      <th>Budget</th>
                      <th>Message</th>
                      <th>Source</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${contactSubmissions.map(sub => `
                      <tr>
                        <td>${sub.name}</td>
                        <td>${sub.email}</td>
                        <td><span class="badge">${sub.service}</span></td>
                        <td>${sub.budget || 'N/A'}</td>
                        <td>${sub.message.substring(0, 100)}${sub.message.length > 100 ? '...' : ''}</td>
                        <td>${sub.source || 'N/A'}</td>
                        <td><span class="meta">${new Date(sub.created_at).toLocaleString()}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              
              <div class="section">
                <h2>Audit Requests (${auditRequests.length})</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Website</th>
                      <th>Audit Type</th>
                      <th>Goal</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${auditRequests.map(req => `
                      <tr>
                        <td>${req.name}</td>
                        <td>${req.email}</td>
                        <td><a href="${req.website_url}" target="_blank">${req.website_url}</a></td>
                        <td><span class="badge">${req.audit_type}</span></td>
                        <td>${req.goal || 'N/A'}</td>
                        <td><span class="meta">${new Date(req.created_at).toLocaleString()}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              
              <div class="section">
                <p><small>Admin Dashboard - SparkCrux Digital Agency</small></p>
              </div>
            </div>
          </body>
        </html>
      `);
    });
  });
});

// Serve static files (existing HTML, CSS, JS)
app.use(express.static('.'));

// Catch-all handler - serve index.html for any route that doesn't match
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 SparkCrux server running on http://localhost:${PORT}`);
      console.log(`📊 Admin panel: http://localhost:${PORT}/admin?password=${process.env.ADMIN_PASSWORD}`);
      console.log('📁 Serving static files from current directory');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});

// Start server
startServer();
