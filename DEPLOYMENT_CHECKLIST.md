# 🚀 Deployment Checklist

## ✅ Files Ready
- [x] `vercel.json` - Root configuration
- [x] `frontend/vercel.json` - Frontend configuration
- [x] `backend/vercel.json` - Backend configuration
- [x] `.gitignore` - Prevents sensitive files from being committed
- [x] `.gitattributes` - Handles line endings
- [x] CORS updated for production
- [x] Environment variable structure ready

## 📋 Before Deployment

### 1. Create MongoDB Atlas Database
- [ ] Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create a free cluster
- [ ] Create database user with strong password
- [ ] Whitelist all IPs: `0.0.0.0/0`
- [ ] Copy connection string

### 2. Prepare Environment Variables

#### Backend (Railway/Render)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/finance-tracker
JWT_SECRET=minimum_32_characters_secret_key_change_this_now
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=https://your-app.vercel.app
```

#### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.railway.app/api
VITE_APP_NAME=Finance Tracker
```

### 3. Deploy Backend First
- [ ] Choose platform: Railway (Recommended) / Render / Heroku
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Add all environment variables
- [ ] Deploy and copy the backend URL

### 4. Deploy Frontend
- [ ] Go to [Vercel Dashboard](https://vercel.com)
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Framework: Vite
- [ ] Add environment variables (use backend URL from step 3)
- [ ] Deploy

### 5. Update Backend with Frontend URL
- [ ] Go back to backend deployment platform
- [ ] Update `FRONTEND_URL` with your Vercel URL
- [ ] Redeploy backend

### 6. Test Production
- [ ] Test backend health: `curl https://your-backend.railway.app/health`
- [ ] Open frontend URL
- [ ] Register new account
- [ ] Create transaction
- [ ] Verify dashboard works

## 🎯 Deployment Options

### Option A: Railway + Vercel (Recommended)
**Backend:** Railway.app (Free $5/month credit)
**Frontend:** Vercel (Free unlimited)
**Best for:** Hobby projects, startups

### Option B: Render + Vercel
**Backend:** Render.com (Free 750 hours/month)
**Frontend:** Vercel (Free unlimited)
**Best for:** Projects with moderate traffic

### Option C: Heroku + Vercel
**Backend:** Heroku (Free 1000 hours/month)
**Frontend:** Vercel (Free unlimited)
**Best for:** Projects needing add-ons

## ⚠️ Important Notes

### Security
- **Never commit** `config.env` or `.env` files
- Use **strong JWT_SECRET** (32+ characters)
- **Whitelist IPs** in MongoDB Atlas
- Keep environment variables **secret**

### Performance
- MongoDB Atlas free tier: 512 MB storage
- Railway free tier: ~500 hours/month
- Vercel: Unlimited bandwidth on free tier

### Limitations
- **Backend cold starts:** First request may be slow (serverless)
- **MongoDB connections:** Use connection pooling
- **File uploads:** Not recommended on free tiers

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check `FRONTEND_URL` in backend env vars |
| MongoDB connection fails | Verify IP whitelist and connection string |
| 500 errors | Check backend logs and environment variables |
| Frontend shows "Network Error" | Verify `VITE_API_URL` is correct |
| JWT not working | Ensure `JWT_SECRET` is 32+ characters |

## 📚 Documentation Links

- **Full Guide:** See `VERCEL_DEPLOYMENT.md`
- **Quick Start:** See `QUICK_START.md` for local development
- **Bug Fixes:** See `BUG_FIXES.md` for resolved issues
- **Features:** See `FEATURES.md` for API documentation

## 🎉 After Deployment

- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/alerts
- [ ] Set up automated backups for MongoDB
- [ ] Add Google Analytics (optional)
- [ ] Create user documentation

## 📞 Support

If you encounter issues:
1. Check backend logs in deployment platform
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Test backend endpoint directly with curl
5. Check MongoDB Atlas connection

---

**Estimated Time to Deploy:** 30-45 minutes

**Current Status:** ✅ Code is production-ready. Follow checklist above to deploy!
