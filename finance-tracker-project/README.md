# Finance Tracker

A full-stack finance tracking application built with React and Node.js.

## Project Structure

```
finance-tracker-project/
├── backend/          # Node.js/Express backend API
│   ├── controllers/  # Request handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   ├── utils/        # Utility functions
│   ├── config.env    # Environment configuration
│   └── server.js     # Server entry point
│
├── frontend/         # React frontend application
│   ├── src/          # React source files
│   ├── public/       # Static assets
│   ├── index.html    # Entry HTML file
│   └── vite.config.js # Vite configuration
│
└── package.json      # Root package with orchestration scripts
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

Install all dependencies (root, backend, and frontend):
```bash
npm run install:all
```

Or install individually:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

#### Backend Configuration
Create a `config.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

#### Frontend Configuration
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Finance Tracker
```

**Note:** The frontend `.env` file has been created with default values. Modify `VITE_API_URL` if your backend runs on a different port or domain.

### Running the Application

#### Run Both Frontend & Backend Concurrently (Recommended)
```bash
npm run dev
```

#### Run Backend Only
```bash
npm run backend:dev
# or
cd backend
npm run dev
```

#### Run Frontend Only
```bash
npm run frontend:dev
# or
cd frontend
npm run dev
```

### Production Build

```bash
npm run build
```

## Tech Stack

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Morgan** - HTTP logger
- **Express Rate Limit** - Rate limiting

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

## License

MIT
