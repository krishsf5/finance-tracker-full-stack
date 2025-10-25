# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Environment variables configured
- [x] CORS settings updated for production
- [x] Build scripts configured
- [x] vercel.json files created
- [x] .gitignore properly set up
- [ ] MongoDB Atlas database created
- [ ] Environment variables prepared

---

## Deployment Strategy

**Two Options:**

### Option 1: Separate Deployments (Recommended)
- **Frontend:** Deployed to Vercel
- **Backend:** Deployed to Railway/Render/Heroku (better for persistent API servers)

### Option 2: Monorepo on Vercel
- Both frontend and backend on Vercel (using Serverless Functions)

**We'll use Option 1** as it's more reliable for MongoDB connections and long-running processes.

---

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user:
   - Username: `financeapp`
   - Password: Generate strong password
4. Add network access:
   - Click "Network Access"
   - Add IP: `0.0.0.0/0` (Allow from anywhere)
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"

### 2.2 Configure Backend
1. Select your repository
2. Select `backend` folder as root directory
3. Add environment variables:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=https://your-app.vercel.app
```

### 2.3 Deploy
1. Railway will auto-deploy
2. Copy the generated URL (e.g., `https://your-backend.railway.app`)
3. Note this URL for frontend configuration

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 3.2 Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 3.3 Add Environment Variables

In Vercel project settings → Environment Variables:

```env
VITE_API_URL=https://your-backend.railway.app/api
VITE_APP_NAME=Finance Tracker
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `https://your-app.vercel.app`

---

## Step 4: Update Backend with Frontend URL

1. Go back to Railway dashboard
2. Add/Update environment variable:
   ```env
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Redeploy backend

---

## Step 5: Test Production Deployment

### 5.1 Test Backend Health
```bash
curl https://your-backend.railway.app/health
```

Expected response:
```json
{
  "status": "success",
  "message": "API is running",
  "data": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 1234,
    "environment": "production"
  }
}
```

### 5.2 Test Frontend
1. Open `https://your-app.vercel.app`
2. Try to register a new account
3. Login and create a transaction
4. Check dashboard loads correctly

---

## Alternative: Deploy Backend to Render

### Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub

### Deploy Backend
1. Click "New" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name:** finance-tracker-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. Add environment variables (same as Railway)

5. Deploy and copy the URL

---

## Alternative: Deploy Backend to Heroku

### Prerequisites
```bash
npm install -g heroku
heroku login
```

### Deploy Steps
```bash
# Navigate to backend folder
cd backend

# Create Heroku app
heroku create finance-tracker-backend

# Add MongoDB addon OR use Atlas
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key
heroku config:set JWT_EXPIRE=7d
heroku config:set FRONTEND_URL=https://your-app.vercel.app

# Deploy
git subtree push --prefix backend heroku main

# OR if in backend folder
git init
git add .
git commit -m "Deploy to Heroku"
heroku git:remote -a finance-tracker-backend
git push heroku main
```

---

## Environment Variables Reference

### Backend (Railway/Render/Heroku)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/finance-tracker
JWT_SECRET=minimum_32_characters_super_secret_key_change_this
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.railway.app/api
VITE_APP_NAME=Finance Tracker
```

---

## Troubleshooting

### Issue: CORS Errors
**Solution:**
1. Check `FRONTEND_URL` is set correctly in backend
2. Verify frontend is using correct `VITE_API_URL`
3. Check backend CORS configuration allows Vercel domains

### Issue: MongoDB Connection Fails
**Solution:**
1. Verify `MONGODB_URI` is correct
2. Check IP whitelist in MongoDB Atlas (should have `0.0.0.0/0`)
3. Ensure password doesn't have special characters (or URL encode them)

### Issue: 500 Internal Server Error
**Solution:**
1. Check backend logs in Railway/Render dashboard
2. Verify all environment variables are set
3. Check MongoDB connection string

### Issue: Frontend Shows "Network Error"
**Solution:**
1. Verify `VITE_API_URL` includes `/api` at the end
2. Check backend is running: `curl https://your-backend.railway.app/health`
3. Open browser console for detailed error

### Issue: JWT Token Not Working
**Solution:**
1. Ensure `JWT_SECRET` is at least 32 characters
2. Check `credentials: true` is in CORS config
3. Verify frontend is sending token in Authorization header

---

## Post-Deployment

### 1. Set Up Custom Domain (Optional)
**Vercel:**
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records

**Railway/Render:**
- Similar process in their dashboards

### 2. Monitor Your App
**Frontend (Vercel):**
- Vercel Analytics automatically enabled
- Check deployment logs

**Backend (Railway):**
- View logs in Railway dashboard
- Set up error alerts

### 3. Set Up CI/CD
**Automatic Deployments:**
- Vercel: Automatically deploys on git push
- Railway: Automatically deploys on git push
- Configure to deploy only on `main` branch

### 4. Security Checklist
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] MongoDB IP whitelist configured
- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] Rate limiting active
- [ ] Helmet security headers enabled
- [ ] Environment variables never committed

---

## Cost Breakdown

### Free Tier Limits:
- **Vercel:** Unlimited bandwidth, 100 GB hours/month
- **Railway:** $5 free credit/month (~500 hours)
- **Render:** 750 hours/month free
- **MongoDB Atlas:** 512 MB storage free
- **Heroku:** 1000 dyno hours/month free (with credit card)

### Estimated Monthly Cost:
- **Free usage:** $0 for hobby projects
- **With traffic:** $5-20/month depending on usage

---

## Quick Deploy Commands

```bash
# Deploy frontend to Vercel
cd frontend
vercel

# Deploy backend to Railway (via Git)
git add .
git commit -m "Deploy to production"
git push origin main

# Railway will auto-deploy
```

---

## Summary

✅ **What We Created:**
1. `vercel.json` files for configuration
2. Updated CORS for production
3. Environment variable templates
4. Deployment documentation

✅ **What You Need to Do:**
1. Create MongoDB Atlas database
2. Deploy backend to Railway/Render
3. Deploy frontend to Vercel
4. Configure environment variables
5. Test the deployment

---

## Support Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

**Your app is now ready for deployment! 🚀**

Follow the steps above, and you'll have a production-ready Finance Tracker in about 30 minutes.
