const express = require('express');
const {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  addContribution,
  getGoalStats
} = require('../controllers/goalController');
const { protect, checkOwnership } = require('../middleware/auth');
const {
  validateGoal,
  validatePagination,
  validateObjectId
} = require('../middleware/validation');
const Goal = require('../models/Goal');

const router = express.Router();

// All routes are protected
router.use(protect);

// GET /api/goals/stats
router.get('/stats', getGoalStats);

// GET /api/goals
router.get('/', validatePagination, getGoals);

// GET /api/goals/:id
router.get('/:id', validateObjectId(), checkOwnership(Goal), getGoal);

// POST /api/goals
router.post('/', validateGoal, createGoal);

// PUT /api/goals/:id
router.put('/:id', validateObjectId(), validateGoal, checkOwnership(Goal), updateGoal);

// DELETE /api/goals/:id
router.delete('/:id', validateObjectId(), checkOwnership(Goal), deleteGoal);

// POST /api/goals/:id/contribute
router.post('/:id/contribute', validateObjectId(), checkOwnership(Goal), addContribution);

module.exports = router;
