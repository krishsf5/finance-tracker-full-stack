import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createTransaction, deleteTransaction as deleteTransactionAction, getTransactions } from '../store/slices/transactionSlice'
import notificationService from '../utils/notificationService'

const Transactions = () => {
  const dispatch = useDispatch()
  const { transactions, loading, error } = useSelector(state => state.transactions)
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  // Filter and sort transactions - add null check
  const filteredTransactions = (transactions || [])
    .filter(transaction => {
      const matchesFilter = filter === 'all' || transaction.type === filter
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date)
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount
      } else if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category)
      }
      return sortOrder === 'desc' ? -comparison : comparison
    })

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const transactionData = {
      type: formData.get('type'),
      category: formData.get('category'),
      amount: parseFloat(formData.get('amount')),
      description: formData.get('description'),
      date: new Date().toISOString()
    }
    
    try {
      const result = await dispatch(createTransaction(transactionData)).unwrap()
      setShowAddModal(false)
      e.target.reset()
      
      // Send notification for new transaction
      notificationService.transactionAdded({
        ...result,
        type: transactionData.type,
        amount: transactionData.type === 'income' ? transactionData.amount : -transactionData.amount
      })
      
      // Refresh transactions list
      dispatch(getTransactions({ page: 1, limit: 100 }))
    } catch (err) {
      console.error('Failed to create transaction:', err)
    }
  }
  
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await dispatch(deleteTransactionAction(id)).unwrap()
        // Refresh transactions list
        dispatch(getTransactions({ page: 1, limit: 100 }))
      } catch (err) {
        console.error('Failed to delete transaction:', err)
      }
    }
  }

  // Show loading spinner
  if (loading && (!transactions || transactions.length === 0)) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-brand)' }}></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Transactions</h2>
          <p className="mt-1" style={{ color: 'var(--text-body)' }}>Manage your income and expenses</p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
          style={{
            backgroundColor: 'var(--color-brand)',
            color: 'white',
            focusRingColor: 'var(--color-brand)'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Transaction
        </button>
      </div>

      {/* Filters and Search */}
      <div 
        className="rounded-xl shadow-sm border p-6"
        style={{ 
          backgroundColor: 'var(--bg-primary)', 
          borderColor: 'var(--border-color)',
          boxShadow: '0 1px 3px var(--shadow-color)'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-body)' }}>Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-2 focus:border-2"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-body)',
                  focusRingColor: 'var(--color-brand)',
                  focusBorderColor: 'var(--color-brand)'
                }}
              />
              <i className="fas fa-search absolute left-3 top-2.5 text-sm" style={{ color: 'var(--text-muted)' }}></i>
            </div>
          </div>

          {/* Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-body)' }}>Type</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-2 focus:border-2"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-body)',
                focusRingColor: 'var(--color-brand)',
                focusBorderColor: 'var(--color-brand)'
              }}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-body)' }}>Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-2 focus:border-2"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-body)',
                focusRingColor: 'var(--color-brand)',
                focusBorderColor: 'var(--color-brand)'
              }}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {/* Sort Order Toggle */}
        <div className="mt-4 flex items-center space-x-2">
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors"
            style={{ color: 'var(--text-body)' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--hover-bg)'
              e.target.style.color = 'var(--text-heading)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = 'var(--text-body)'
            }}
          >
            <svg className={`h-4 w-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div 
        className="rounded-xl shadow-sm border overflow-hidden"
        style={{ 
          backgroundColor: 'var(--bg-primary)', 
          borderColor: 'var(--border-color)',
          boxShadow: '0 1px 3px var(--shadow-color)'
        }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </h3>
        </div>
        
        <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {filteredTransactions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <i className="fas fa-receipt mx-auto text-4xl mb-4" style={{ color: 'var(--text-muted)' }}></i>
              <h3 className="mt-2 text-sm font-medium" style={{ color: 'var(--text-heading)' }}>No transactions found</h3>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Get started by adding a new transaction.</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div 
                key={transaction._id || transaction.id} 
                className="px-6 py-4 transition-colors"
                style={{ 
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="h-10 w-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: transaction.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)',
                        opacity: 0.1
                      }}
                    >
                      <i 
                        className={`fas ${transaction.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'} text-lg`}
                        style={{ color: transaction.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)' }}
                      ></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>{transaction.description}</p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{transaction.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p 
                        className="text-sm font-semibold"
                        style={{ color: transaction.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)' }}
                      >
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteTransaction(transaction._id || transaction.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--color-danger)'
                        e.target.style.backgroundColor = 'var(--color-danger)'
                        e.target.style.opacity = '0.1'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--text-muted)'
                        e.target.style.backgroundColor = 'transparent'
                        e.target.style.opacity = '1'
                      }}
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddTransaction}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Transaction</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                          <select
                            name="type"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <input
                            type="text"
                            name="category"
                            required
                            placeholder="e.g., Salary, Food, Transport"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                          <input
                            type="number"
                            name="amount"
                            required
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <input
                            type="text"
                            name="description"
                            required
                            placeholder="Transaction description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions
