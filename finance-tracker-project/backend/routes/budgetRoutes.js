const express = require('express');
const {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetPerformance
} = require('../controllers/budgetController');
const { protect, checkOwnership } = require('../middleware/auth');
const {
  validateBudget,
  validatePagination,
  validateObjectId
} = require('../middleware/validation');
const Budget = require('../models/Budget');

const router = express.Router();

// All routes are protected
router.use(protect);

// GET /api/budgets
router.get('/', validatePagination, getBudgets);

// GET /api/budgets/:id
router.get('/:id', validateObjectId(), checkOwnership(Budget), getBudget);

// GET /api/budgets/:id/performance
router.get('/:id/performance', validateObjectId(), checkOwnership(Budget), getBudgetPerformance);

// POST /api/budgets
router.post('/', validateBudget, createBudget);

// PUT /api/budgets/:id
router.put('/:id', validateObjectId(), validateBudget, checkOwnership(Budget), updateBudget);

// DELETE /api/budgets/:id
router.delete('/:id', validateObjectId(), checkOwnership(Budget), deleteBudget);

module.exports = router;
