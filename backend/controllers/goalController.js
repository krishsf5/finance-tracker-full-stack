const Goal = require('../models/Goal');
const { asyncHandler } = require('../utils/asyncHandler');

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
const getGoals = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type, isActive, isCompleted } = req.query;

  const query = { user: req.user._id };
  if (type) query.type = type;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (isCompleted !== undefined) query.isCompleted = isCompleted === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const goals = await Goal.find(query)
    .sort({ priority: -1, targetDate: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Goal.countDocuments(query);

  res.json({
    success: true,
    count: goals.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: {
      goals
    }
  });
});

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
const getGoal = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      goal: req.resource
    }
  });
});

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
const createGoal = asyncHandler(async (req, res) => {
  const goalData = {
    ...req.body,
    user: req.user._id
  };

  const goal = await Goal.create(goalData);

  res.status(201).json({
    success: true,
    message: 'Goal created successfully',
    data: {
      goal
    }
  });
});

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Goal updated successfully',
    data: {
      goal
    }
  });
});

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  await Goal.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Goal deleted successfully'
  });
});

// @desc    Add contribution to goal
// @route   POST /api/goals/:id/contribute
// @access  Private
const addContribution = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid contribution amount is required'
    });
  }

  await req.resource.addContribution(amount, description);

  const updatedGoal = await Goal.findById(req.params.id);

  res.json({
    success: true,
    message: 'Contribution added successfully',
    data: {
      goal: updatedGoal
    }
  });
});

// @desc    Get goal statistics
// @route   GET /api/goals/stats
// @access  Private
const getGoalStats = asyncHandler(async (req, res) => {
  const stats = await Goal.getGoalStats(req.user._id);

  res.json({
    success: true,
    data: {
      stats
    }
  });
});

module.exports = {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  addContribution,
  getGoalStats
};
