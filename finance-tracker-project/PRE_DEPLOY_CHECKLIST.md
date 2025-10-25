# ✅ Pre-Deployment Checklist

Before deploying to Vercel, make sure everything is ready:

---

## 📋 Code Readiness

### **Git Repository:**
- [ ] Git initialized: `git init`
- [ ] All files committed: `git status` shows clean
- [ ] Pushed to GitHub: `git push origin main`
- [ ] Repository is public or Vercel has access

### **Frontend (React + Vite):**
- [ ] `frontend/package.json` exists
- [ ] `frontend/vercel.json` configured
- [ ] `frontend/.env.example` exists
- [ ] Build works locally: `cd frontend && npm run build`
- [ ] `frontend/dist/` folder created successfully
- [ ] No errors in build output

### **Backend (Node.js + Express):**
- [ ] `backend/package.json` exists
- [ ] `backend/vercel.json` configured (if deploying to Vercel)
- [ ] `backend/config.env.example` exists
- [ ] Backend runs locally: `cd backend && npm start`
- [ ] All routes respond correctly
- [ ] MongoDB connection works

---

## 🔐 Security

### **Environment Files:**
- [ ] `.gitignore` includes:
  - [ ] `node_modules/`
  - [ ] `.env`
  - [ ] `*.env`
  - [ ] `config.env`
  - [ ] `backend/config.env`
- [ ] NO sensitive data in code
- [ ] NO API keys hardcoded
- [ ] NO passwords in files
- [ ] Check: `git log` doesn't show secrets

### **Strong Secrets:**
- [ ] JWT_SECRET is 32+ characters
- [ ] MongoDB password is strong
- [ ] No default passwords used

---

## 🗄️ Database

### **MongoDB Atlas:**
- [ ] Account created
- [ ] Cluster created (free tier)
- [ ] Database user created
- [ ] User has correct permissions
- [ ] IP whitelist: `0.0.0.0/0` added
- [ ] Connection string copied
- [ ] Connection string tested locally
- [ ] Database name is set (e.g., `finance-tracker`)

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

---

## 🚀 Backend Deployment (Railway/Render)

### **Railway Setup:**
- [ ] Railway account created
- [ ] GitHub connected
- [ ] Repository imported
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`

### **Environment Variables (Backend):**
- [ ] `PORT=5000`
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI=[your connection string]`
- [ ] `JWT_SECRET=[32+ random characters]`
- [ ] `JWT_EXPIRE=7d`
- [ ] `BCRYPT_ROUNDS=12`
- [ ] `RATE_LIMIT_WINDOW_MS=900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS=100`
- [ ] `FRONTEND_URL=[will add after Vercel deployment]`

### **Backend Testing:**
- [ ] Backend deployed successfully
- [ ] URL generated (e.g., `https://your-backend.railway.app`)
- [ ] Health endpoint works: `curl https://your-backend.railway.app/health`
- [ ] Returns JSON response
- [ ] No 500 errors in logs

---

## 🎨 Frontend Deployment (Vercel)

### **Vercel Setup:**
- [ ] Vercel account created
- [ ] GitHub connected
- [ ] Repository imported
- [ ] Framework preset: Vite (detected)
- [ ] Root directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Install command: `npm install`

### **Environment Variables (Frontend):**
- [ ] `VITE_API_URL=[backend URL]/api`
  - Example: `https://your-backend.railway.app/api`
  - NO trailing slash on /api!
- [ ] `VITE_APP_NAME=Finance Tracker`

**Important:** Add environment variables BEFORE deploying!

### **Frontend Testing:**
- [ ] Frontend deployed successfully
- [ ] URL generated (e.g., `https://your-app.vercel.app`)
- [ ] Page loads without errors
- [ ] No 404 errors
- [ ] Assets load correctly

---

## 🔄 Post-Deployment Configuration

### **Update Backend CORS:**
- [ ] Go back to Railway/Render
- [ ] Add/Update `FRONTEND_URL` with Vercel URL
- [ ] Example: `https://your-app.vercel.app`
- [ ] NO trailing slash!
- [ ] Redeploy backend
- [ ] Wait for deployment to complete

---

## 🧪 Full System Testing

### **Authentication:**
- [ ] Open your Vercel URL
- [ ] Click "Create a new account"
- [ ] Register with:
  - Name: Test User
  - Email: test@example.com
  - Password: Test123!
- [ ] Registration succeeds
- [ ] Automatically logged in
- [ ] User name displays in header
- [ ] User name displays in sidebar

### **Transactions:**
- [ ] Click "Transactions"
- [ ] Click "+ Add Transaction"
- [ ] Add Income:
  - Type: Income
  - Category: Salary
  - Amount: 5000
  - Description: Monthly Salary
- [ ] Transaction appears in list
- [ ] Notification appears (if enabled)
- [ ] Dashboard balance updates

### **Features:**
- [ ] Dashboard shows correct data
- [ ] Charts render properly
- [ ] Analytics page works
- [ ] Settings page accessible
- [ ] Dark mode toggle works
- [ ] Dark mode persists on refresh
- [ ] Notifications can be enabled
- [ ] Notification center opens
- [ ] Logout works
- [ ] Login works with saved credentials

### **Performance:**
- [ ] App loads in < 3 seconds
- [ ] No console errors (F12)
- [ ] No network errors in DevTools
- [ ] Smooth animations
- [ ] Responsive on mobile
- [ ] Works on different browsers

---

## 🌐 Optional: Custom Domain

### **If Using Custom Domain:**
- [ ] Domain purchased
- [ ] Domain added to Vercel project
- [ ] DNS records updated:
  - CNAME: `www` → `cname.vercel-dns.com`
  - A: `@` → `76.76.21.21`
- [ ] Wait for DNS propagation (5-60 min)
- [ ] SSL certificate issued (automatic)
- [ ] HTTPS works
- [ ] Update backend `FRONTEND_URL` with new domain
- [ ] Redeploy backend

---

## 📊 Monitoring Setup

### **Vercel Analytics:**
- [ ] Analytics tab accessible
- [ ] Page views tracking
- [ ] No errors in analytics

### **Error Monitoring:**
- [ ] Check deployment logs
- [ ] Check runtime logs
- [ ] Set up error alerts (optional)

---

## 📱 Mobile Testing

### **Responsive Design:**
- [ ] Open on mobile browser
- [ ] Layout responsive
- [ ] Buttons clickable
- [ ] Forms usable
- [ ] Navigation works
- [ ] All features accessible

---

## 🐛 Common Issues Check

### **If Something Doesn't Work:**

**CORS Errors:**
- [ ] `FRONTEND_URL` matches Vercel URL exactly
- [ ] No trailing slash in `FRONTEND_URL`
- [ ] Backend redeployed after adding `FRONTEND_URL`

**MongoDB Errors:**
- [ ] IP whitelist includes `0.0.0.0/0`
- [ ] Connection string format correct
- [ ] Username/password correct (no special characters issues)
- [ ] Database name specified in connection string

**API Not Found (404):**
- [ ] `VITE_API_URL` includes `/api` at end
- [ ] Backend is running (check Railway logs)
- [ ] Routes are correct

**Build Failures:**
- [ ] All dependencies in `package.json`
- [ ] No TypeScript errors
- [ ] No ESLint errors preventing build
- [ ] Build works locally first

---

## ✅ Final Go/No-Go Decision

**Ready to Deploy if ALL true:**
- ✅ All checkboxes above are checked
- ✅ Local builds succeed
- ✅ Backend responds to health check
- ✅ MongoDB connection works
- ✅ Environment variables prepared
- ✅ Git repository ready

**NOT Ready if ANY true:**
- ❌ Build fails locally
- ❌ MongoDB connection fails
- ❌ Missing environment variables
- ❌ Secrets committed to git
- ❌ Backend doesn't start

---

## 🚀 Deploy Commands

### **If All Checks Pass:**

```bash
# 1. Commit and push
git add .
git commit -m "Production ready"
git push origin main

# 2. Deploy backend (Railway/Render via dashboard)

# 3. Deploy frontend
cd frontend
vercel --prod

# 4. Update backend FRONTEND_URL
# (via Railway/Render dashboard)

# 5. Test live application
```

---

## 🎉 Success Criteria

**Your deployment is successful when:**
- ✅ Vercel URL loads the app
- ✅ Can register new account
- ✅ Can login
- ✅ Can add transaction
- ✅ Dashboard shows data
- ✅ No console errors
- ✅ Backend responds correctly
- ✅ Database stores data
- ✅ All features work

---

## 📞 Help Resources

- **VERCEL_READY.md** - Detailed deployment guide
- **VERCEL_DEPLOYMENT.md** - Alternative deployment options
- **QUICK_START.md** - Local development guide
- **TROUBLESHOOTING.md** - Common issues and solutions

---

## 📈 What's Next?

**After Successful Deployment:**
1. Share your app URL
2. Monitor usage in Vercel analytics
3. Check logs regularly
4. Add custom domain (optional)
5. Set up monitoring alerts
6. Plan feature updates

---

**Good luck with your deployment! 🚀**

Use this checklist to ensure nothing is missed!
