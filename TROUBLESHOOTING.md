# Troubleshooting Guide

## Common Issues and Solutions

### ✅ FIXED: "process is not defined" Error

**Error:**
```
api.js:5 Uncaught ReferenceError: process is not defined
```

**Cause:**
The frontend was using `process.env` (Node.js syntax) instead of Vite's `import.meta.env` syntax.

**Solution Applied:**
- Changed `process.env.REACT_APP_API_URL` to `import.meta.env.VITE_API_URL` in `frontend/src/services/api.js`
- Created `frontend/.env` with proper Vite environment variables
- Created `frontend/.env.example` as a template

**How to Use:**
1. The `.env` file is already created with default values
2. If your backend runs on a different port, update `VITE_API_URL` in `frontend/.env`
3. Restart the frontend dev server: `npm run frontend:dev`

---

## Environment Variables

### Vite Environment Variables (Frontend)
- **Must be prefixed with `VITE_`** to be exposed to the client
- Access via `import.meta.env.VITE_VARIABLE_NAME`
- Defined in `frontend/.env`

Example:
```javascript
// ✅ Correct (Vite)
const apiUrl = import.meta.env.VITE_API_URL;

// ❌ Wrong (Node.js only)
const apiUrl = process.env.REACT_APP_API_URL;
```

### Node.js Environment Variables (Backend)
- Access via `process.env.VARIABLE_NAME`
- Defined in `backend/config.env`
- Loaded with `dotenv` package

---

## Quick Fixes

### Frontend not connecting to backend?
1. Check if backend is running: `http://localhost:5000/health`
2. Verify `VITE_API_URL` in `frontend/.env` matches your backend URL
3. Restart the frontend dev server after changing `.env`

### CORS errors?
1. Backend CORS is configured for:
   - `http://localhost:3000`
   - `http://localhost:5173` (Vite default)
2. Check `backend/server.js` CORS configuration if using different port

### JWT token issues?
1. Check `JWT_SECRET` is set in `backend/config.env`
2. Clear localStorage in browser DevTools: `localStorage.clear()`
3. Re-login to get a fresh token

### MongoDB connection failed?
1. Verify `MONGODB_URI` in `backend/config.env`
2. Check MongoDB is running (local) or credentials are correct (Atlas)
3. Ensure IP whitelist is configured (if using MongoDB Atlas)

---

## Development Tips

### Restarting Servers
```bash
# Restart both (from root)
npm run dev

# Restart backend only
cd backend
npm run dev

# Restart frontend only
cd frontend
npm run dev
```

### Checking Logs
- **Frontend**: Open browser DevTools Console
- **Backend**: Check terminal where backend is running

### Clearing Cache
```bash
# Frontend
cd frontend
rm -rf node_modules/.vite
npm run dev

# Backend
cd backend
# No cache clearing needed
```

---

## Port Conflicts

If ports are already in use:

**Backend (default: 5000)**
- Change `PORT` in `backend/config.env`
- Update `VITE_API_URL` in `frontend/.env` accordingly

**Frontend (default: 5173 for Vite)**
- Vite will automatically use next available port
- Or specify port: `vite --port 3000`

---

## Getting Help

1. Check this troubleshooting guide
2. Review `README.md` for setup instructions
3. Check `FEATURES.md` for API documentation
4. Look at error messages in browser console and terminal
