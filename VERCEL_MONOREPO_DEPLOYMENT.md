# Vercel Monorepo Deployment Guide

This guide walks you through deploying both frontend and backend on Vercel as a monorepo.

## ✅ What We've Configured

- ✅ Backend converted to serverless functions
- ✅ MongoDB Atlas connection with pooling
- ✅ Frontend environment configuration
- ✅ Vercel configuration files set up
- ✅ API routing configured

---

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Git Repository** - Your code should be in GitHub/GitLab/Bitbucket
3. **MongoDB Atlas** - Already configured with your connection string

---

## Step 1: Push Code to Git Repository

```bash
# Initialize git if not already done
cd c:\Users\krish\Desktop\sameer-fsd\finance-tracker-project
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Vercel deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/finance-tracker.git

# Push
git push -u origin main
```

---

## Step 2: Import Project to Vercel

### Via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your repository
5. Vercel will automatically detect the `vercel.json` configuration

### Configure Build Settings

Vercel should auto-detect the settings, but verify:

- **Framework Preset**: Other
- **Root Directory**: `./` (leave as root since it's a monorepo)
- **Build Command**: (Leave default - Vercel will use vercel.json)
- **Output Directory**: (Leave default)
- **Install Command**: `npm install`

---

## Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables

### Add Backend Environment Variables:

| Name | Value | Notes |
|------|-------|-------|
| `NODE_ENV` | `production` | Required |
| `MONGODB_URI` | `mongodb+srv://Vercel-Admin-Finance-tracker:tpbvsCScH7sywHSb@finance-tracker.oujmk0a.mongodb.net/?retryWrites=true&w=majority` | Your MongoDB Atlas connection |
| `JWT_SECRET` | (Generate a secure 32+ character string) | **IMPORTANT: Change from default!** |
| `JWT_EXPIRE` | `7d` | Token expiration |
| `BCRYPT_ROUNDS` | `12` | Password hashing rounds |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |

### Add Frontend Environment Variables:

| Name | Value | Notes |
|------|-------|-------|
| `VITE_API_URL` | `/api` | Use relative path since everything is on same domain |

### How to Generate a Secure JWT_SECRET:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online generator
# Visit: https://randomkeygen.com/
```

**⚠️ Important**: Make sure to apply environment variables to **All Environments** (Production, Preview, Development)

---

## Step 4: Add Database Name to MongoDB URI

Your current MongoDB URI doesn't specify a database name. Update it:

**Current:**
```
mongodb+srv://Vercel-Admin-Finance-tracker:tpbvsCScH7sywHSb@finance-tracker.oujmk0a.mongodb.net/?retryWrites=true&w=majority
```

**Updated (Add database name):**
```
mongodb+srv://Vercel-Admin-Finance-tracker:tpbvsCScH7sywHSb@finance-tracker.oujmk0a.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

Add the database name `/finance-tracker` before the `?` in the URI.

---

## Step 5: Deploy

1. Click **"Deploy"** in Vercel dashboard
2. Vercel will:
   - Install dependencies for root, frontend, and backend
   - Build the frontend (Vite)
   - Set up serverless functions for backend
   - Configure routing

3. Wait for deployment to complete (usually 2-5 minutes)

---

## Step 6: Test Your Deployment

### Test Backend API

Visit: `https://your-app.vercel.app/health`

Expected response:
```json
{
  "status": "success",
  "message": "Finance Tracker API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Frontend

1. Visit: `https://your-app.vercel.app`
2. Try to register a new account
3. Login
4. Create a test transaction
5. Check if dashboard loads

---

## File Structure Overview

```
finance-tracker-project/
├── vercel.json                 # Root config (routes frontend + backend)
├── frontend/
│   ├── .env.development       # Local dev API URL
│   ├── .env.production        # Production API URL (relative)
│   ├── package.json
│   └── ...
└── backend/
    ├── vercel.json            # Backend-specific config
    ├── api/
    │   └── index.js          # Serverless entry point
    ├── server.js             # Express app (no app.listen in production)
    ├── config.env            # Local dev environment variables
    └── ...
```

---

## How It Works

### Routing

Vercel uses the root `vercel.json` to route requests:

1. **API Requests** (`/api/*`):
   - Routed to `backend/api/index.js`
   - Runs as serverless function
   - Connects to MongoDB Atlas

2. **Frontend Requests** (`/*`):
   - Serves static files from `frontend/dist`
   - Built during deployment

### Serverless Functions

- Each API request triggers a serverless function
- MongoDB connection is reused when possible (connection pooling)
- Functions run for max 10 seconds on Free tier (60s on Pro)

---

## Troubleshooting

### 1. Build Fails

**Check:**
- All dependencies installed locally work
- `npm run build` works in frontend folder
- No syntax errors in code

**Solution:**
```bash
# Test locally first
cd frontend
npm install
npm run build

cd ../backend
npm install
```

### 2. API Returns 404

**Check:**
- Environment variables are set
- MongoDB URI includes database name
- Backend logs in Vercel dashboard

**Solution:**
- Go to Vercel Dashboard → Your Project → Functions
- Click on a function to see logs
- Check for errors

### 3. MongoDB Connection Errors

**Error:** `MongoServerError: Authentication failed`

**Solution:**
- Verify MongoDB Atlas credentials
- Check password doesn't have special characters (or URL encode them)
- Ensure IP whitelist includes `0.0.0.0/0` in MongoDB Atlas

### 4. CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
- Check backend `server.js` CORS configuration
- Verify it allows Vercel domains (already configured)

### 5. Cold Starts

**Symptom:** First API request after inactivity takes 5-10 seconds

**Explanation:** 
- Serverless functions "sleep" when not used
- This is normal behavior on Free tier
- Consider Vercel Pro for better performance

---

## Environment Variables Security

### ⚠️ Important Security Notes:

1. **Never commit these files:**
   - `config.env`
   - `.env`
   - `.env.local`
   - `.env.production.local`

2. **Already in `.gitignore`:**
   ```
   config.env
   .env
   .env*.local
   ```

3. **Use Vercel Dashboard for production secrets**
   - Don't hardcode credentials
   - Use environment variables

---

## Monitoring & Logs

### View Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Functions" tab
4. Click any function to see logs
5. Or click "View Function Logs" for all

### View Build Logs

1. Go to Deployments
2. Click on a deployment
3. View build logs and errors

---

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records:
   - Type: `A` or `CNAME`
   - Value: Provided by Vercel
4. Wait for DNS propagation (5-60 minutes)

---

## Automatic Deployments

Vercel automatically deploys when you push to Git:

- **Production**: Deploys from `main` or `master` branch
- **Preview**: Deploys from other branches and PRs
- **Development**: Can deploy from any branch

Configure in: Settings → Git → Production Branch

---

## Costs

### Vercel Free Tier:
- ✅ 100 GB bandwidth/month
- ✅ Unlimited serverless function invocations
- ✅ 100 GB-Hours compute time
- ✅ Automatic HTTPS
- ✅ Deploy previews

### Vercel Pro ($20/month):
- 1 TB bandwidth
- 1000 GB-Hours compute
- Better performance
- Faster cold starts

### MongoDB Atlas Free Tier:
- 512 MB storage
- Shared clusters
- Sufficient for development/small apps

---

## Next Steps After Deployment

1. **Test thoroughly**
   - Create test accounts
   - Test all features
   - Check mobile responsiveness

2. **Monitor errors**
   - Check Vercel function logs
   - Set up error tracking (Sentry, LogRocket)

3. **Update CORS if needed**
   - Add any custom domains
   - Update allowed origins in backend

4. **Set up analytics**
   - Vercel Analytics (built-in)
   - Google Analytics
   - Custom event tracking

5. **Create backup strategy**
   - MongoDB Atlas automatic backups
   - Export data regularly

---

## Quick Reference

### Deploy New Changes

```bash
git add .
git commit -m "Your changes"
git push
# Vercel auto-deploys
```

### Redeploy Without Changes

1. Go to Vercel Dashboard
2. Deployments → Latest → ⋯ → Redeploy

### Rollback Deployment

1. Go to Vercel Dashboard
2. Deployments → Find previous working version
3. Click ⋯ → Promote to Production

---

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## Summary Checklist

- [ ] Code pushed to Git repository
- [ ] Project imported to Vercel
- [ ] Environment variables configured
- [ ] MongoDB URI includes database name
- [ ] JWT_SECRET changed from default
- [ ] Deployment successful
- [ ] `/health` endpoint works
- [ ] Frontend loads
- [ ] User registration works
- [ ] Login works
- [ ] Transactions work
- [ ] Dashboard displays data

---

**🚀 Your Finance Tracker is now live on Vercel!**

Access it at: `https://your-project.vercel.app`

All API requests automatically route to `/api/*` on the same domain.
