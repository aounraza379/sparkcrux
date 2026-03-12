# SparkCrux Deployment Guide

## 🚀 Quick Overview

This guide covers secure deployment of your SparkCrux website with proper credential management and free hosting options.

## 🔐 Security First - Managing Credentials

### Environment Variables (Never Commit to Git)

Your `.env` file contains sensitive information:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
DATABASE_PATH=./database/sparkcrux.db

# Admin Panel - CHANGE THIS!
ADMIN_PASSWORD=your_secure_admin_password_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=3

# Security
SESSION_SECRET=your_session_secret_here_change_this_in_production
```

### 🔴 SECURITY RULES:
1. **NEVER** commit `.env` to Git (already in .gitignore)
2. **ALWAYS** use strong, unique passwords in production
3. **CHANGE** default passwords before deploying
4. **USE** different secrets for each environment

## 🆓 Free Hosting Options

### Option 1: Railway (Recommended - Easiest)

**Pros:**
- Free tier available
- Automatic HTTPS
- Easy environment variable management
- Git-based deployment
- Built for Node.js apps

**Steps:**

1. **Sign Up**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub (free)

2. **Prepare Your Repo**
   ```bash
   # Make sure your code is committed
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Deploy on Railway**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your SparkCrux repository
   - Railway will detect it's a Node.js app

4. **Configure Environment Variables**
   - Go to your project → "Variables" tab
   - Add these variables:
   ```
   NODE_ENV=production
   PORT=3000
   ADMIN_PASSWORD=your_secure_password_here
   SESSION_SECRET=your_random_secret_here
   DATABASE_PATH=/app/database/sparkcrux.db
   RATE_LIMIT_WINDOW_MS=3600000
   RATE_LIMIT_MAX_REQUESTS=3
   ```

5. **Deploy**
   - Railway will automatically deploy
   - You'll get a URL like `sparkcrux.up.railway.app`

### Option 2: Render (Also Good)

**Steps:**

1. **Sign Up** at [render.com](https://render.com)
2. **Connect GitHub** and select your repo
3. **Choose "Web Service"**
4. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables in dashboard

### Option 3: Vercel (Frontend Focus)

**Good for static files, limited for backend**

1. **Sign Up** at [vercel.com](https://vercel.com)
2. **Install Vercel CLI:** `npm i -g vercel`
3. **Deploy:** `vercel --prod`

### Option 4: Free VPS (More Control)

**Oracle Cloud Free Tier** or **AWS Free Tier**

**Pros:**
- Full control
- Can run anything
- Free for 12 months (AWS) or always free (Oracle)

**Cons:**
- More complex setup
- Requires credit card (with $0 charge)

## 🛠 Step-by-Step Railway Deployment (Recommended)

### Step 1: Prepare Your Code

```bash
# Update your admin password
# Edit .env file and change ADMIN_PASSWORD
ADMIN_PASSWORD=SparkCrux2025Secure!@#

# Generate a random session secret
# You can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=your_generated_hex_here
```

### Step 2: Update package.json for Production

```bash
# Make sure your package.json has this scripts section:
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Production ready with secure credentials"
git push origin main
```

### Step 4: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. "Deploy from GitHub repo"
4. Select your repository
5. Wait for automatic detection
6. Add environment variables
7. Click "Deploy"

### Step 5: Test Your Deployment

1. Railway will give you a URL
2. Test the website
3. Test the admin panel: `your-url.railway.app/admin?password=your_password`
4. Test form submissions

## 🔧 Production Optimizations

### 1. Database Persistence

Railway's filesystem is ephemeral. For persistent database:

```javascript
// In server.js, update database path:
const dbPath = process.env.DATABASE_PATH || '/app/database/sparkcrux.db';
```

### 2. Add Health Check

Add this to server.js:

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### 3. Error Handling

Update your error handling for production:

```javascript
// Add better error logging
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
```

## 🌐 Custom Domain Setup

### On Railway (Free)

1. Go to your project → "Settings"
2. Click "Custom Domains"
3. Add your domain (e.g., sparkcrux.com)
4. Update your DNS:
   ```
   Type: CNAME
   Name: @
   Value: cname.railway.app
   ```

### Free Domain Options

1. **Freenom** - Free .tk, .ml, .ga domains
2. **No-IP** - Free subdomains
3. **GitHub Pages** - Your username.github.io (for static only)

## 🔒 Security Best Practices

### 1. Environment Variables

```bash
# Always use different values for production
NODE_ENV=production
ADMIN_PASSWORD=UseAGeneratorLikeLastPass-2025!
SESSION_SECRET=another-random-32-byte-hex-string
```

### 2. Database Security

- SQLite is file-based, but ensure:
- Database file is not in public folder
- Regular backups (download database file)

### 3. Rate Limiting

```bash
# Adjust for production needs
RATE_LIMIT_MAX_REQUESTS=10  # More lenient for real users
RATE_LIMIT_WINDOW_MS=3600000  # 1 hour
```

### 4. Admin Panel Security

- Use strong password (16+ chars, mixed case, numbers, symbols)
- Consider IP whitelisting in future
- Log admin access attempts

## 📊 Monitoring and Logs

### Railway Logs

1. Go to your project → "Logs" tab
2. Monitor:
   - Form submissions
   - Error messages
   - Rate limiting hits

### Key Log Messages to Watch

```
✅ Contact form submitted successfully
✅ Audit request submitted successfully
⚠️ Rate limit exceeded for IP: xxx.xxx.xxx.xxx
❌ Database error: [error details]
```

## 🔄 Backup Strategy

### Database Backup

```bash
# Download database file regularly
# In Railway, you can access files via the dashboard
# Or add backup endpoint in server.js:

app.get('/admin/backup', (req, res) => {
  const password = req.query.password;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).send('Unauthorized');
  }
  
  res.download(dbPath, 'sparkcrux_backup.db');
});
```

### Git Backup

```bash
# Regular commits
git add .
git commit -m "Backup: $(date)"
git push origin main
```

## 🚨 Troubleshooting

### Common Issues

1. **Database not persisting**
   - Railway's free tier has ephemeral storage
   - Consider external database for production

2. **Forms not working**
   - Check environment variables
   - Check logs for errors
   - Verify API endpoints

3. **Admin panel not accessible**
   - Check ADMIN_PASSWORD in environment variables
   - Verify URL format: `/admin?password=your_password`

4. **Rate limiting too strict**
   - Adjust RATE_LIMIT_MAX_REQUESTS
   - Check if multiple users share same IP

### Debug Mode

Add this to server.js for debugging:

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}
```

## 📱 Mobile Testing

After deployment, test on:
- Different browsers (Chrome, Firefox, Safari)
- Mobile devices
- Form submissions
- Admin panel

## 🎯 Next Steps

1. **Deploy to Railway** using this guide
2. **Test thoroughly** all features
3. **Set up custom domain** (optional)
4. **Monitor logs** regularly
5. **Back up database** weekly

## 🆘 Help and Support

If you run into issues:

1. **Check Railway logs** first
2. **Verify environment variables**
3. **Test locally** with same settings
4. **Check this guide** for troubleshooting

## 📞 Quick Deployment Checklist

- [ ] Change ADMIN_PASSWORD to strong value
- [ ] Generate new SESSION_SECRET
- [ ] Set NODE_ENV=production
- [ ] Test all forms work
- [ ] Test admin panel access
- [ ] Check mobile responsiveness
- [ ] Verify rate limiting works
- [ ] Set up monitoring/alerts
- [ ] Plan backup strategy

---

**Ready to deploy? Start with Railway - it's the easiest and most reliable free option!**
