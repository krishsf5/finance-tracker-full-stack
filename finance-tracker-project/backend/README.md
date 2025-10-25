# Finance Tracker Backend API

A secure, production-ready RESTful API for the Finance Tracker application built with Node.js, Express.js, MongoDB, and Mongoose.

## Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 🛡️ **Security** - Helmet, CORS, rate limiting, input validation
- 📊 **Transaction Management** - CRUD operations for financial transactions
- 💰 **Budget Tracking** - Create and monitor spending budgets
- 🎯 **Goal Setting** - Savings and financial goal management
- 📈 **Analytics** - Financial insights and reporting
- 🔒 **Data Validation** - Comprehensive input validation and sanitization
- 📝 **Logging** - Request logging and error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: express-validator
- **Rate Limiting**: express-rate-limit

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update user profile
- `PUT /api/auth/update-password` - Update password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password/:token` - Reset password
- `DELETE /api/auth/delete-account` - Delete account

### Transactions
- `GET /api/transactions` - Get all transactions (with pagination, filtering)
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get transaction statistics
- `GET /api/transactions/categories` - Get category breakdown
- `GET /api/transactions/trends` - Get monthly trends

### Budgets
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/:id` - Get single budget
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/:id/performance` - Get budget performance

### Goals
- `GET /api/goals` - Get all goals
- `GET /api/goals/:id` - Get single goal
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/contribute` - Add contribution to goal
- `GET /api/goals/stats` - Get goal statistics

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp config.env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/finance-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Documentation

### Authentication Flow

1. **Register**: `POST /api/auth/register`
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "SecurePass123"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "john@example.com",
     "password": "SecurePass123"
   }
   ```

3. **Use Token**: Include in Authorization header
   ```
   Authorization: Bearer <jwt-token>
   ```

### Transaction Example

```json
{
  "type": "expense",
  "amount": 25.50,
  "description": "Coffee and pastry",
  "category": "Food & Dining",
  "date": "2024-01-15T10:30:00Z",
  "paymentMethod": "credit_card"
}
```

### Budget Example

```json
{
  "name": "Monthly Groceries",
  "category": "Food & Dining",
  "amount": 500,
  "period": "monthly",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

### Goal Example

```json
{
  "name": "Emergency Fund",
  "type": "savings",
  "targetAmount": 10000,
  "targetDate": "2024-12-31",
  "priority": "high"
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with configurable rounds
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers for protection
- **Error Handling**: Centralized error handling and logging

## Database Models

### User Model
- Authentication fields (email, password)
- Profile information (name, avatar)
- Preferences (currency, dateFormat, darkMode, notifications)
- Account status and verification

### Transaction Model
- Financial data (amount, type, description, category)
- Metadata (date, paymentMethod, location, tags)
- Recurring transaction support
- File attachments support

### Budget Model
- Budget configuration (name, amount, period)
- Date ranges and alerts
- Performance tracking
- Category-based budgeting

### Goal Model
- Goal definition (name, type, targetAmount, targetDate)
- Progress tracking (currentAmount, contributions)
- Milestones and priority
- Visual customization (color, icon)

## Error Handling

The API uses a centralized error handling system:

- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource not found)
- **429**: Too Many Requests (rate limit exceeded)
- **500**: Internal Server Error

## Development

### Project Structure
```
backend/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── utils/          # Utility functions
├── config.env      # Environment variables
├── server.js       # Application entry point
└── package.json    # Dependencies and scripts
```

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

## Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Use secure JWT secret
   - Configure MongoDB Atlas or production database
   - Set up proper CORS origins

2. **Security Considerations**
   - Use HTTPS in production
   - Implement proper logging
   - Set up monitoring and alerts
   - Regular security updates

3. **Performance**
   - Database indexing
   - Connection pooling
   - Caching strategies
   - Load balancing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
