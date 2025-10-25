const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Goal must belong to a user']
  },
  name: {
    type: String,
    required: [true, 'Please provide a goal name'],
    trim: true,
    maxlength: [100, 'Goal name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify goal type'],
    enum: ['savings', 'debt_payment', 'investment', 'purchase', 'emergency_fund', 'other'],
    default: 'savings'
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please provide target amount'],
    min: [0.01, 'Target amount must be greater than 0']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  targetDate: {
    type: Date,
    required: [true, 'Please provide target date']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  color: {
    type: String,
    default: '#3B82F6',
    match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color']
  },
  icon: {
    type: String,
    default: 'fas fa-bullseye'
  },
  milestones: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Milestone name cannot be more than 100 characters']
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  contributions: [{
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    date: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot be more than 200 characters']
    },
    source: {
      type: String,
      enum: ['manual', 'automatic', 'transfer'],
      default: 'manual'
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
goalSchema.index({ user: 1, isActive: 1 });
goalSchema.index({ user: 1, type: 1 });
goalSchema.index({ user: 1, priority: 1 });
goalSchema.index({ user: 1, targetDate: 1 });
goalSchema.index({ user: 1, isCompleted: 1 });

// Virtual for goal progress
goalSchema.virtual('progress').get(function() {
  const percentage = (this.currentAmount / this.targetAmount) * 100;
  return {
    percentage: Math.min(percentage, 100),
    amount: this.currentAmount,
    target: this.targetAmount,
    remaining: Math.max(this.targetAmount - this.currentAmount, 0)
  };
});

// Virtual for goal status
goalSchema.virtual('status').get(function() {
  const now = new Date();
  const targetDate = new Date(this.targetDate);
  
  if (this.isCompleted) return 'completed';
  if (this.currentAmount >= this.targetAmount) return 'achieved';
  if (now > targetDate) return 'overdue';
  if (this.progress.percentage >= 90) return 'almost_there';
  if (this.progress.percentage >= 50) return 'good_progress';
  return 'just_started';
});

// Virtual for time remaining
goalSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const targetDate = new Date(this.targetDate);
  const diffTime = targetDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { days: 0, status: 'overdue' };
  if (diffDays === 0) return { days: 0, status: 'due_today' };
  if (diffDays <= 7) return { days: diffDays, status: 'due_soon' };
  if (diffDays <= 30) return { days: diffDays, status: 'due_this_month' };
  return { days: diffDays, status: 'plenty_of_time' };
});

// Virtual for suggested monthly contribution
goalSchema.virtual('suggestedMonthlyContribution').get(function() {
  const now = new Date();
  const targetDate = new Date(this.targetDate);
  const diffTime = targetDate - now;
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  
  if (diffMonths <= 0) return 0;
  
  const remainingAmount = this.targetAmount - this.currentAmount;
  return Math.ceil(remainingAmount / diffMonths);
});

// Pre-save middleware to handle goal completion
goalSchema.pre('save', function(next) {
  if (this.currentAmount >= this.targetAmount && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  next();
});

// Method to add contribution
goalSchema.methods.addContribution = function(amount, description = '', source = 'manual') {
  this.currentAmount += amount;
  this.contributions.push({
    amount,
    description,
    source,
    date: new Date()
  });
  return this.save();
};

// Method to update milestone
goalSchema.methods.updateMilestone = function(milestoneIndex, isCompleted = true) {
  if (this.milestones[milestoneIndex]) {
    this.milestones[milestoneIndex].isCompleted = isCompleted;
    if (isCompleted) {
      this.milestones[milestoneIndex].completedAt = new Date();
    }
  }
  return this.save();
};

// Static method to get user's active goals
goalSchema.statics.getActiveGoals = async function(userId) {
  return await this.find({
    user: userId,
    isActive: true,
    isCompleted: false
  }).sort({ priority: -1, targetDate: 1 });
};

// Static method to get goal statistics
goalSchema.statics.getGoalStats = async function(userId) {
  const goals = await this.find({ user: userId });
  
  const stats = {
    total: goals.length,
    active: goals.filter(g => g.isActive && !g.isCompleted).length,
    completed: goals.filter(g => g.isCompleted).length,
    overdue: goals.filter(g => g.status === 'overdue').length,
    totalTargetAmount: goals.reduce((sum, g) => sum + g.targetAmount, 0),
    totalCurrentAmount: goals.reduce((sum, g) => sum + g.currentAmount, 0)
  };
  
  stats.overallProgress = stats.totalTargetAmount > 0 
    ? (stats.totalCurrentAmount / stats.totalTargetAmount) * 100 
    : 0;
    
  return stats;
};

module.exports = mongoose.model('Goal', goalSchema);
