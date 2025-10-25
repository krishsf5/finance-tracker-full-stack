const express = require('express');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
  getCategoryBreakdown,
  getMonthlyTrends
} = require('../controllers/transactionController');
const { protect, checkOwnership } = require('../middleware/auth');
const {
  validateTransaction,
  validateTransactionUpdate,
  validatePagination,
  validateDateRange,
  validateObjectId
} = require('../middleware/validation');
const Transaction = require('../models/Transaction');

const router = express.Router();

// All routes are protected
router.use(protect);

// GET /api/transactions/stats
router.get('/stats', getTransactionStats);

// GET /api/transactions/categories
router.get('/categories', getCategoryBreakdown);

// GET /api/transactions/trends
router.get('/trends', getMonthlyTrends);

// GET /api/transactions
router.get('/', validatePagination, validateDateRange, getTransactions);

// GET /api/transactions/:id
router.get('/:id', validateObjectId(), checkOwnership(Transaction), getTransaction);

// POST /api/transactions
router.post('/', validateTransaction, createTransaction);

// PUT /api/transactions/:id
router.put('/:id', validateObjectId(), validateTransactionUpdate, checkOwnership(Transaction), updateTransaction);

// DELETE /api/transactions/:id
router.delete('/:id', validateObjectId(), checkOwnership(Transaction), deleteTransaction);

module.exports = router;
