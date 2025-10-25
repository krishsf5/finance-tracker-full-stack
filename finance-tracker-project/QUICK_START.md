# Quick Start Guide

## Prerequisites
- Node.js v14+ installed
- MongoDB running (local or MongoDB Atlas)

## Step 1: Install Dependencies

```bash
npm run install:all
```

This installs dependencies for root, backend, and frontend.

## Step 2: Configure Backend Environment

Create `backend/config.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

## Step 3: Configure Frontend Environment

The `frontend/.env` is already created with:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Finance Tracker
```

## Step 4: Start the Application

### Option A: Run Both Servers Together (Recommended)
```bash
npm run dev
```

This starts:
- Backend on http://localhost:5000
- Frontend on http://localhost:5173

### Option B: Run Separately
```bash
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend
npm run frontend:dev
```

## Step 5: Create Your First Account

1. Open http://localhost:5173 in your browser
2. Click "Create a new account"
3. Fill in your details:
   - Name
   - Email
   - Password (min 6 chars, must have uppercase, lowercase, and number)
4. Click "Create account"

You'll be automatically logged in!

## Step 6: Add Your First Transaction

1. Click "Transactions" in the sidebar
2. Click "+ Add Transaction"
3. Fill in:
   - Type: Income or Expense
   - Category: e.g., "Salary", "Food", "Transport"
   - Amount: e.g., 1000
   - Description: e.g., "Monthly salary"
4. Click "Add Transaction"

## Step 7: Explore Features

- **Dashboard**: View your balance, income, expenses, and charts
- **Transactions**: Manage all your transactions with filtering and sorting
- **Analytics**: View detailed charts and trends
- **Settings**: Customize your preferences

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify `backend/config.env` exists with correct values
- Check port 5000 is not in use

### Frontend won't start
- Verify `frontend/.env` exists
- Check port 5173 is not in use
- Clear cache: `cd frontend && rm -rf node_modules/.vite && npm run dev`

### Can't login / 401 errors
- Make sure backend is running and MongoDB is connected
- Check `JWT_SECRET` is set in `backend/config.env`
- Clear browser localStorage: F12 > Application > Local Storage > Clear

### CORS errors
- Verify `VITE_API_URL` in `frontend/.env` matches your backend URL
- Backend CORS is configured for `http://localhost:5173` by default

## API Testing

Test backend health:
```bash
curl http://localhost:5000/health
```

Test registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123"}'
```

## Production Deployment

See `README.md` for production deployment instructions.

## Support

- Check `TROUBLESHOOTING.md` for common issues
- Review `FEATURES.md` for API documentation
- Check browser console (F12) for frontend errors
- Check terminal for backend errors

## Default Ports

- Backend: 5000
- Frontend: 5173 (Vite default)
- MongoDB: 27017 (default)

Enjoy your Finance Tracker! 🚀💰
