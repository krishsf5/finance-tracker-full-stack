const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Transaction must belong to a user']
  },
  type: {
    type: String,
    required: [true, 'Please specify transaction type'],
    enum: ['income', 'expense'],
    lowercase: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide transaction amount'],
    min: [0.01, 'Amount must be greater than 0']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
    maxlength: [50, 'Category cannot be more than 50 characters']
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [50, 'Subcategory cannot be more than 50 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please provide transaction date'],
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'digital_wallet', 'check', 'other'],
    default: 'cash'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot be more than 20 characters']
  }],
  location: {
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: {
      type: Number,
      min: 1
    },
    endDate: Date,
    nextDueDate: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, date: 1 });
transactionSchema.index({ user: 1, amount: 1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return {
    value: this.amount,
    formatted: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.amount)
  };
});

// Virtual for transaction summary
transactionSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    type: this.type,
    amount: this.amount,
    description: this.description,
    category: this.category,
    date: this.date,
    paymentMethod: this.paymentMethod
  };
});

// Pre-save middleware to handle recurring transactions
transactionSchema.pre('save', function(next) {
  if (this.isRecurring && this.recurringPattern) {
    const now = new Date();
    if (!this.recurringPattern.nextDueDate) {
      this.recurringPattern.nextDueDate = this.date;
    }
  }
  next();
});

// Static method to get user's transaction summary
transactionSchema.statics.getUserSummary = async function(userId, startDate, endDate) {
  const matchStage = {
    user: new mongoose.Types.ObjectId(userId)
  };
  
  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const summary = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    income: { total: 0, count: 0 },
    expense: { total: 0, count: 0 },
    netIncome: 0
  };

  summary.forEach(item => {
    if (item._id === 'income') {
      result.income = { total: item.total, count: item.count };
    } else if (item._id === 'expense') {
      result.expense = { total: item.total, count: item.count };
    }
  });

  result.netIncome = result.income.total - result.expense.total;
  return result;
};

// Static method to get category breakdown
transactionSchema.statics.getCategoryBreakdown = async function(userId, startDate, endDate) {
  const matchStage = {
    user: new mongoose.Types.ObjectId(userId),
    type: 'expense'
  };
  
  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 10 }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);
