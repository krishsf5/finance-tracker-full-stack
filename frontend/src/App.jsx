import { useState, useEffect } from 'react'
import './App.css'

// Components
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import Analytics from './components/Analytics'
import Settings from './components/Settings'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [balance, setBalance] = useState(0)
  const [darkMode, setDarkMode] = useState(false)

  // Load sample data on component mount
  useEffect(() => {
    const sampleTransactions = [
      { id: 1, type: 'income', category: 'Salary', amount: 5000, description: 'Monthly salary', date: '2024-01-15' },
      { id: 2, type: 'expense', category: 'Food', amount: -150, description: 'Grocery shopping', date: '2024-01-14' },
      { id: 3, type: 'expense', category: 'Transport', amount: -50, description: 'Gas', date: '2024-01-13' },
      { id: 4, type: 'income', category: 'Freelance', amount: 800, description: 'Web design project', date: '2024-01-12' },
      { id: 5, type: 'expense', category: 'Entertainment', amount: -75, description: 'Movie tickets', date: '2024-01-11' },
    ]
    setTransactions(sampleTransactions)
    
    // Calculate initial balance
    const initialBalance = sampleTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
    setBalance(initialBalance)
  }, [])

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    }
    setTransactions([newTransaction, ...transactions])
    setBalance(prev => prev + transaction.amount)
  }

  const deleteTransaction = (id) => {
    const transaction = transactions.find(t => t.id === id)
    if (transaction) {
      setBalance(prev => prev - transaction.amount)
      setTransactions(transactions.filter(t => t.id !== id))
    }
  }

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
        return <Transactions transactions={transactions} onAddTransaction={addTransaction} onDeleteTransaction={deleteTransaction} />
      case 'analytics':
        return <Analytics transactions={transactions} />
      case 'settings':
        return <Settings darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      default:
        return <Dashboard transactions={transactions} balance={balance} />
    }
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        balance={balance}
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

export default App
