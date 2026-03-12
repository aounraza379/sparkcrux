# 🚀 Railway Deployment - Step by Step

## Quick Start (5 minutes)

### 1. Update Your Security Credentials

**Edit your `.env` file RIGHT NOW:**

```bash
# Change these values:
ADMIN_PASSWORD=SparkCrux2025Secure!@#ChangeMe
SESSION_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwxy234zab567cde890fgh123
```

**Generate a secure session secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Commit Your Code

```bash
git add .
git commit -m "Production ready with secure credentials"
git push origin main
```

### 3. Deploy to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub** (free)
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your SparkCrux repository**
6. **Wait for automatic detection** (Railway will see it's Node.js)

### 4. Add Environment Variables

In Railway dashboard → "Variables" tab:

```
NODE_ENV=production
PORT=3000
ADMIN_PASSWORD=SparkCrux2025Secure!@#ChangeMe
SESSION_SECRET=your_generated_hex_here
DATABASE_PATH=/app/database/sparkcrux.db
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=3
```

### 5. Deploy!

Click "Deploy" and wait 2-3 minutes.

### 6. Test Your Live Site

Railway will give you a URL like: `sparkcrux-production.up.railway.app`

**Test these URLs:**
- Main site: `your-url.railway.app`
- Admin panel: `your-url.railway.app/admin?password=your_admin_password`
- Health check: `your-url.railway.app/health`

## 🔧 What Railway Does Automatically

✅ **HTTPS/SSL** - Free SSL certificate  
✅ **Custom Domain** - Easy to add later  
✅ **Environment Variables** - Secure storage  
✅ **Automatic Deployments** - Git push triggers  
✅ **Logs** - Real-time error monitoring  
✅ **Scaling** - Handles traffic automatically  

## 🆓 Free Tier Limits

- **500 hours/month** runtime
- **100GB bandwidth** 
- **Unlimited projects**
- **No credit card required**

## 🚨 Important Security Notes

### BEFORE DEPLOYING:

1. **Change the admin password** in Railway environment variables
2. **Use a unique session secret** (not the example)
3. **Never share your environment variables**
4. **Keep your .env file out of Git** (already done)

### AFTER DEPLOYING:

1. **Test the admin panel** works with your password
2. **Submit test forms** to verify database works
3. **Check the logs** for any errors
4. **Monitor rate limiting** isn't too strict

## 📱 Testing Checklist

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] Audit form submits successfully  
- [ ] Admin panel accessible with password
- [ ] Mobile responsive works
- [ ] No console errors
- [ ] Forms show success messages

## 🔄 Updates and Maintenance

**To update your site:**
```bash
# Make changes locally
git add .
git commit -m "Update: Your change description"
git push origin main
# Railway auto-deploys!
```

**To check logs:**
1. Go to Railway dashboard
2. Select your project
3. Click "Logs" tab

## 🆘 Common Issues

### "Database not found"
- Railway creates database on first form submission
- Submit a test form to initialize

### "Admin panel not working"
- Check ADMIN_PASSWORD environment variable
- Verify URL format: `/admin?password=your_password`

### "Forms not submitting"
- Check environment variables are set correctly
- Look at Railway logs for errors

## 🎯 You're Live!

Once deployed, you'll have:
- **Live website** with HTTPS
- **Working forms** that save to database
- **Admin dashboard** to view submissions
- **Professional URL** from Railway
- **Free hosting** that scales

Ready to start? **Go to railway.app and deploy in 5 minutes!** 🚀
