import { useState, useMemo } from 'react'

const Dashboard = ({ transactions = [], balance = 0 }) => {
  const [timeRange, setTimeRange] = useState('month')

  // Calculate financial metrics
  const metrics = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    let filteredTransactions = transactions || []
    
    if (timeRange === 'month') {
      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
      })
    } else if (timeRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredTransactions = transactions.filter(t => new Date(t.date) >= weekAgo)
    }

    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = Math.abs(filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0))
    
    const netIncome = income - expenses

    return { income, expenses, netIncome, transactionCount: filteredTransactions.length }
  }, [transactions, timeRange])

  // Get recent transactions
  const recentTransactions = (transactions || []).slice(0, 5)

  // Get category breakdown
  const categoryBreakdown = useMemo(() => {
    const categories = {}
    ;(transactions || []).forEach(transaction => {
      if (transaction.type === 'expense') {
        categories[transaction.category] = (categories[transaction.category] || 0) + Math.abs(transaction.amount)
      }
    })
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
  }, [transactions])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Dashboard</h2>
          <p className="mt-1" style={{ color: 'var(--text-body)' }}>Welcome back! Here's your financial overview.</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-2 focus:border-2"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-body)',
              focusRingColor: 'var(--color-brand)',
              focusBorderColor: 'var(--color-brand)'
            }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)',
            boxShadow: '0 1px 3px var(--shadow-color)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Balance</p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-heading)' }}>${balance.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-success)', opacity: 0.1 }}>
              <i className="fas fa-wallet text-2xl" style={{ color: 'var(--color-success)' }}></i>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)',
            boxShadow: '0 1px 3px var(--shadow-color)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Income</p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-success)' }}>${metrics.income.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-success)', opacity: 0.1 }}>
              <i className="fas fa-arrow-up text-2xl" style={{ color: 'var(--color-success)' }}></i>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)',
            boxShadow: '0 1px 3px var(--shadow-color)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Expenses</p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-danger)' }}>${metrics.expenses.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-danger)', opacity: 0.1 }}>
              <i className="fas fa-arrow-down text-2xl" style={{ color: 'var(--color-danger)' }}></i>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)',
            boxShadow: '0 1px 3px var(--shadow-color)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Net Income</p>
              <p 
                className="text-2xl font-bold mt-1"
                style={{ color: metrics.netIncome >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}
              >
                ${metrics.netIncome.toLocaleString()}
              </p>
            </div>
            <div 
              className="h-12 w-12 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: metrics.netIncome >= 0 ? 'var(--color-success)' : 'var(--color-danger)', 
                opacity: 0.1 
              }}
            >
              <i 
                className="fas fa-chart-line text-2xl"
                style={{ color: metrics.netIncome >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}
              ></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Transactions */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Category Breakdown */}
        <div 
          className="rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow flex-1"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)',
            boxShadow: '0 1px 3px var(--shadow-color)'
          }}
        >
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-heading)' }}>Top Categories</h3>
          <div className="space-y-4">
            {categoryBreakdown.length === 0 ? (
              <p className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No expense data available</p>
            ) : (
              categoryBreakdown.map(([category, amount], index) => (
                <div key={category} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: index === 0 ? '#3B82F6' :
                                        index === 1 ? '#10B981' :
                                        index === 2 ? '#F59E0B' :
                                        index === 3 ? '#8B5CF6' : '#EC4899'
                      }}
                    ></div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>{category}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>${amount.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div 
          className="rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow flex-1"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)',
            boxShadow: '0 1px 3px var(--shadow-color)'
          }}
        >
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-heading)' }}>Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No transactions available</p>
            ) : (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: transaction.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)',
                        opacity: 0.1
                      }}
                    >
                      <i 
                        className={`fas ${transaction.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'} text-sm`}
                        style={{ color: transaction.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)' }}
                      ></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>{transaction.description}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p 
                      className="text-sm font-semibold"
                      style={{ color: transaction.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)' }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
