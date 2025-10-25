const Budget = require('../models/Budget');
const { asyncHandler } = require('../utils/asyncHandler');

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isActive } = req.query;

  const query = { user: req.user._id };
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const budgets = await Budget.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Budget.countDocuments(query);

  res.json({
    success: true,
    count: budgets.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: {
      budgets
    }
  });
});

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
const getBudget = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      budget: req.resource
    }
  });
});

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
const createBudget = asyncHandler(async (req, res) => {
  const budgetData = {
    ...req.body,
    user: req.user._id
  };

  const budget = await Budget.create(budgetData);

  res.status(201).json({
    success: true,
    message: 'Budget created successfully',
    data: {
      budget
    }
  });
});

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Budget updated successfully',
    data: {
      budget
    }
  });
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
  await Budget.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Budget deleted successfully'
  });
});

// @desc    Get budget performance
// @route   GET /api/budgets/:id/performance
// @access  Private
const getBudgetPerformance = asyncHandler(async (req, res) => {
  const performance = await Budget.getBudgetPerformance(
    req.params.id,
    req.user._id
  );

  if (!performance) {
    return res.status(404).json({
      success: false,
      message: 'Budget not found'
    });
  }

  res.json({
    success: true,
    data: {
      performance
    }
  });
});

module.exports = {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetPerformance
};
