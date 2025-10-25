const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Budget must belong to a user']
  },
  name: {
    type: String,
    required: [true, 'Please provide a budget name'],
    trim: true,
    maxlength: [100, 'Budget name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
    maxlength: [50, 'Category cannot be more than 50 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide budget amount'],
    min: [0.01, 'Budget amount must be greater than 0']
  },
  period: {
    type: String,
    required: [true, 'Please specify budget period'],
    enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  alertThresholds: [{
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    isEnabled: {
      type: Boolean,
      default: true
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot be more than 20 characters']
  }],
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
budgetSchema.index({ user: 1, isActive: 1 });
budgetSchema.index({ user: 1, category: 1 });
budgetSchema.index({ user: 1, startDate: 1, endDate: 1 });
budgetSchema.index({ user: 1, period: 1 });

// Virtual for budget progress
budgetSchema.virtual('progress').get(function() {
  return {
    amount: this.amount,
    spent: 0, // This will be calculated in the controller
    remaining: this.amount,
    percentage: 0
  };
});

// Virtual for budget status
budgetSchema.virtual('status').get(function() {
  const now = new Date();
  if (now < this.startDate) return 'upcoming';
  if (now > this.endDate) return 'expired';
  return 'active';
});

// Virtual for time remaining
budgetSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const endDate = new Date(this.endDate);
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { days: 0, status: 'expired' };
  if (diffDays === 0) return { days: 0, status: 'ends_today' };
  if (diffDays <= 7) return { days: diffDays, status: 'ending_soon' };
  return { days: diffDays, status: 'active' };
});

// Pre-save middleware to validate dates
budgetSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

// Static method to get user's active budgets
budgetSchema.statics.getActiveBudgets = async function(userId) {
  const now = new Date();
  return await this.find({
    user: userId,
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ createdAt: -1 });
};

// Static method to get budget performance
budgetSchema.statics.getBudgetPerformance = async function(budgetId, userId) {
  const budget = await this.findOne({ _id: budgetId, user: userId });
  if (!budget) return null;

  // Get transactions for this budget period and category
  const Transaction = mongoose.model('Transaction');
  const transactions = await Transaction.find({
    user: userId,
    category: budget.category,
    type: 'expense',
    date: {
      $gte: budget.startDate,
      $lte: budget.endDate
    }
  });

  const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const percentage = (totalSpent / budget.amount) * 100;

  return {
    budget: budget,
    totalSpent: totalSpent,
    remaining: budget.amount - totalSpent,
    percentage: Math.min(percentage, 100),
    isOverBudget: totalSpent > budget.amount,
    transactions: transactions.length
  };
};

module.exports = mongoose.model('Budget', budgetSchema);
