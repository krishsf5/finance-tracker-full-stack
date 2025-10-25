import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeAuth } from './store/slices/authSlice'
import { getTransactions, getTransactionStats } from './store/slices/transactionSlice'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import Analytics from './components/Analytics'
import Settings from './components/Settings'
import Login from './pages/Login'
import Register from './pages/Register'

function AppWithRedux() {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth)
  const { transactions, stats, loading: transactionLoading } = useSelector(state => state.transactions)
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  // Initialize auth on app load
  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  // Load transactions when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(getTransactions({ page: 1, limit: 100 }))
      dispatch(getTransactionStats())
    }
  }, [dispatch, isAuthenticated, user])

  // Calculate balance from transactions
  const balance = transactions.reduce((total, transaction) => {
    return total + (transaction.type === 'income' ? transaction.amount : -transaction.amount)
  }, 0)

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} balance={balance} />
      case 'transactions':
        return <Transactions />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <Settings darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      default:
        return <Dashboard transactions={transactions} balance={balance} />
    }
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-brand)' }}></div>
          <p style={{ color: 'var(--text-body)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  // Show authentication pages if not logged in
  if (!isAuthenticated) {
    if (showRegister) {
      return <Register onSwitchToLogin={() => setShowRegister(false)} />
    }
    return <Login onSwitchToRegister={() => setShowRegister(true)} />
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        balance={balance}
        user={user}
      />
      
      <div className="flex pt-16 w-full">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* Main Content */}
        <main className="flex-1 min-h-screen w-full">
          <div className="p-4 lg:p-8 w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppWithRedux
