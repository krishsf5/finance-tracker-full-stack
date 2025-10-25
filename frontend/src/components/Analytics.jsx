import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'

const Analytics = () => {
  const { transactions } = useSelector(state => state.transactions)
  const [timeRange, setTimeRange] = useState('month')
  const [chartType, setChartType] = useState('category')

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    let filteredTransactions = transactions || []
    
    if (timeRange === 'month') {
      filteredTransactions = (transactions || []).filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
      })
    } else if (timeRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredTransactions = (transactions || []).filter(t => new Date(t.date) >= weekAgo)
    }

    // Income vs Expenses
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = Math.abs(filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0))

    // Category breakdown
    const categoryData = {}
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        categoryData[transaction.category] = (categoryData[transaction.category] || 0) + Math.abs(transaction.amount)
      }
    })

    // Monthly trends (last 6 months)
    const monthlyTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthTransactions = (transactions || []).filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === date.getMonth() && transactionDate.getFullYear() === date.getFullYear()
      })
      
      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const monthExpenses = Math.abs(monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0))
      
      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        income: monthIncome,
        expenses: monthExpenses,
        net: monthIncome - monthExpenses
      })
    }

    return {
      income,
      expenses,
      netIncome: income - expenses,
      categoryData: Object.entries(categoryData).sort(([,a], [,b]) => b - a),
      monthlyTrends
    }
  }, [transactions, timeRange])

  // Calculate percentage for pie chart
  const totalExpenses = analyticsData.categoryData.reduce((sum, [, amount]) => sum + amount, 0)
  const categoryPercentages = analyticsData.categoryData.map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Analytics</h2>
          <p className="mt-1" style={{ color: 'var(--text-body)' }}>Insights into your financial patterns</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-2">
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
          
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-2 focus:border-2"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-body)',
              focusRingColor: 'var(--color-brand)',
              focusBorderColor: 'var(--color-brand)'
            }}
          >
            <option value="category">By Category</option>
            <option value="trends">Monthly Trends</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="rounded-xl shadow-sm border p-6"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)',
            boxShadow: '0 1px 3px var(--shadow-color)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Income</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>${analyticsData.income.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-success)', opacity: 0.1 }}>
              <i className="fas fa-arrow-up text-2xl" style={{ color: 'var(--color-success)' }}></i>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl shadow-sm border p-6"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)',
            boxShadow: '0 1px 3px var(--shadow-color)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Expenses</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-danger)' }}>${analyticsData.expenses.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-danger)', opacity: 0.1 }}>
              <i className="fas fa-arrow-down text-2xl" style={{ color: 'var(--color-danger)' }}></i>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl shadow-sm border p-6"
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
                className="text-2xl font-bold"
                style={{ color: analyticsData.netIncome >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}
              >
                ${analyticsData.netIncome.toLocaleString()}
              </p>
            </div>
            <div 
              className="h-12 w-12 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: analyticsData.netIncome >= 0 ? 'var(--color-success)' : 'var(--color-danger)', 
                opacity: 0.1 
              }}
            >
              <i 
                className="fas fa-chart-line text-2xl"
                style={{ color: analyticsData.netIncome >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}
              ></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        {chartType === 'category' && (
          <div 
            className="rounded-xl shadow-sm border p-6"
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-color)',
              boxShadow: '0 1px 3px var(--shadow-color)'
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
              <i className="fas fa-tags mr-2" style={{ color: 'var(--color-brand)' }}></i>
              Expenses by Category
            </h3>
            {analyticsData.categoryData.length === 0 ? (
              <div className="text-center py-8">
                <p style={{ color: 'var(--text-muted)' }}>No expense data available for the selected period.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoryPercentages.map(({ category, amount, percentage }, index) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>{category}</span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>${amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--border-color)' }}>
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: index === 0 ? '#3B82F6' :
                                          index === 1 ? '#10B981' :
                                          index === 2 ? '#F59E0B' :
                                          index === 3 ? '#8B5CF6' : '#EC4899'
                        }}
                      ></div>
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{percentage.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Monthly Trends */}
        {chartType === 'trends' && (
          <div 
            className="rounded-xl shadow-sm border p-6"
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-color)',
              boxShadow: '0 1px 3px var(--shadow-color)'
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
              <i className="fas fa-chart-line mr-2" style={{ color: 'var(--color-brand)' }}></i>
              Monthly Trends
            </h3>
            <div className="space-y-4">
              {analyticsData.monthlyTrends.map(({ month, income, expenses, net }, index) => (
                <div key={month} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>{month}</span>
                    <span 
                      className="text-sm font-semibold"
                      style={{ color: net >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}
                    >
                      ${net.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-success)' }}>Income:</span>
                      <span style={{ color: 'var(--color-success)' }}>${income.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-danger)' }}>Expenses:</span>
                      <span style={{ color: 'var(--color-danger)' }}>${expenses.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full rounded-full h-1" style={{ backgroundColor: 'var(--border-color)' }}>
                    <div
                      className="h-1 rounded-full"
                      style={{ 
                        width: `${Math.min(Math.abs(net) / Math.max(income, expenses, 1) * 100, 100)}%`,
                        backgroundColor: net >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Income vs Expenses Chart */}
        <div 
          className="rounded-xl shadow-sm border p-6"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)',
            boxShadow: '0 1px 3px var(--shadow-color)'
          }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
            <i className="fas fa-balance-scale mr-2" style={{ color: 'var(--color-brand)' }}></i>
            Income vs Expenses
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--color-success)' }}></div>
                <span className="text-sm" style={{ color: 'var(--text-body)' }}>Income</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>${analyticsData.income.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--color-danger)' }}></div>
                <span className="text-sm" style={{ color: 'var(--text-body)' }}>Expenses</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>${analyticsData.expenses.toLocaleString()}</span>
            </div>
            
            <div className="w-full rounded-full h-4" style={{ backgroundColor: 'var(--border-color)' }}>
              <div className="flex h-4 rounded-full overflow-hidden">
                <div
                  style={{ 
                    width: `${analyticsData.income > 0 ? (analyticsData.income / (analyticsData.income + analyticsData.expenses)) * 100 : 0}%`,
                    backgroundColor: 'var(--color-success)'
                  }}
                ></div>
                <div
                  style={{ 
                    width: `${analyticsData.expenses > 0 ? (analyticsData.expenses / (analyticsData.income + analyticsData.expenses)) * 100 : 0}%`,
                    backgroundColor: 'var(--color-danger)'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div 
        className="rounded-xl shadow-sm border p-6"
        style={{ 
          backgroundColor: 'var(--bg-primary)', 
          borderColor: 'var(--border-color)',
          boxShadow: '0 1px 3px var(--shadow-color)'
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
          <i className="fas fa-lightbulb mr-2" style={{ color: 'var(--color-brand)' }}></i>
          Financial Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center" style={{ color: 'var(--text-heading)' }}>
              <i className="fas fa-chart-pie mr-2" style={{ color: 'var(--color-brand)' }}></i>
              Spending Analysis
            </h4>
            {analyticsData.categoryData.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                  Your top spending category is <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>{analyticsData.categoryData[0][0]}</span> at ${analyticsData.categoryData[0][1].toLocaleString()}.
                </p>
                <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                  You spent ${analyticsData.expenses.toLocaleString()} in {analyticsData.categoryData.length} different categories.
                </p>
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No expense data available for analysis.</p>
            )}
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium flex items-center" style={{ color: 'var(--text-heading)' }}>
              <i className="fas fa-heartbeat mr-2" style={{ color: 'var(--color-brand)' }}></i>
              Financial Health
            </h4>
            <div className="space-y-2">
              <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                Your net income is <span 
                  className="font-semibold"
                  style={{ color: analyticsData.netIncome >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}
                >
                  ${analyticsData.netIncome.toLocaleString()}
                </span>.
              </p>
              {analyticsData.income > 0 && (
                <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                  You're saving <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>
                    {((analyticsData.netIncome / analyticsData.income) * 100).toFixed(1)}%
                  </span> of your income.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
