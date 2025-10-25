const Transaction = require('../models/Transaction');
const { asyncHandler } = require('../utils/asyncHandler');

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = 'date',
    order = 'desc',
    type,
    category,
    startDate,
    endDate,
    search
  } = req.query;

  // Build query
  const query = { user: req.user._id };

  if (type) query.type = type;
  if (category) query.category = new RegExp(category, 'i');
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  if (search) {
    query.$or = [
      { description: new RegExp(search, 'i') },
      { category: new RegExp(search, 'i') }
    ];
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build sort object
  const sortObj = {};
  sortObj[sort] = order === 'desc' ? -1 : 1;

  // Execute query
  const transactions = await Transaction.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  const total = await Transaction.countDocuments(query);

  res.json({
    success: true,
    count: transactions.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: {
      transactions
    }
  });
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      transaction: req.resource
    }
  });
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const transactionData = {
    ...req.body,
    user: req.user._id
  };

  const transaction = await Transaction.create(transactionData);

  res.status(201).json({
    success: true,
    message: 'Transaction created successfully',
    data: {
      transaction
    }
  });
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Transaction updated successfully',
    data: {
      transaction
    }
  });
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Transaction deleted successfully'
  });
});

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats
// @access  Private
const getTransactionStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const summary = await Transaction.getUserSummary(
    req.user._id,
    startDate,
    endDate
  );

  res.json({
    success: true,
    data: {
      summary
    }
  });
});

// @desc    Get category breakdown
// @route   GET /api/transactions/categories
// @access  Private
const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const categories = await Transaction.getCategoryBreakdown(
    req.user._id,
    startDate,
    endDate
  );

  res.json({
    success: true,
    data: {
      categories
    }
  });
});

// @desc    Get monthly trends
// @route   GET /api/transactions/trends
// @access  Private
const getMonthlyTrends = asyncHandler(async (req, res) => {
  const { months = 6 } = req.query;
  
  const trends = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        date: {
          $gte: new Date(Date.now() - parseInt(months) * 30 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        income: {
          $sum: {
            $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
          }
        },
        expenses: {
          $sum: {
            $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
          }
        }
      }
    },
    {
      $addFields: {
        netIncome: { $subtract: ['$income', '$expenses'] },
        month: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: 1
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        month: 1,
        income: 1,
        expenses: 1,
        netIncome: 1
      }
    },
    { $sort: { month: 1 } }
  ]);

  res.json({
    success: true,
    data: {
      trends
    }
  });
});

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
  getCategoryBreakdown,
  getMonthlyTrends
};
