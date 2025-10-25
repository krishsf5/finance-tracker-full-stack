import { useState, useEffect } from 'react'
import NotificationCenter from './NotificationCenter'
import notificationService from '../utils/notificationService'

const Header = ({ sidebarOpen, setSidebarOpen, balance, user }) => {
  const [showBalance, setShowBalance] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load initial unread count
    setUnreadCount(notificationService.getUnreadCount())

    // Listen for notification updates
    const updateCount = () => {
      setUnreadCount(notificationService.getUnreadCount())
    }

    window.addEventListener('notificationAdded', updateCount)
    window.addEventListener('notificationRead', updateCount)
    window.addEventListener('allNotificationsRead', updateCount)
    window.addEventListener('notificationsCleared', updateCount)

    return () => {
      window.removeEventListener('notificationAdded', updateCount)
      window.removeEventListener('notificationRead', updateCount)
      window.removeEventListener('allNotificationsRead', updateCount)
      window.removeEventListener('notificationsCleared', updateCount)
    }
  }, [])
  
  // Get user initials
  const getUserInitials = () => {
    if (!user || !user.name) return 'U'
    const names = user.name.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return names[0][0].toUpperCase()
  }
  
  // Get display name
  const getDisplayName = () => {
    if (!user) return 'User'
    return user.name || user.email || 'User'
  }

  return (
    <header 
      className="shadow-sm border-b fixed w-full top-0 z-40"
      style={{ 
        backgroundColor: 'var(--bg-primary)', 
        borderColor: 'var(--border-color)' 
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu button and title */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="ml-2 text-xl font-semibold" style={{ color: 'var(--text-heading)' }}>Finance Tracker</h1>
          </div>

          {/* Right side - Balance and user menu */}
          <div className="flex items-center space-x-3">
            {/* Balance Display */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--color-brand)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-brand)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-sm font-medium" style={{ color: 'var(--color-brand)' }}>
                  {showBalance ? `$${balance.toLocaleString()}` : '••••••'}
                </span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-brand)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showBalance ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
                </svg>
              </button>
            </div>

            {/* Notifications */}
            <button 
              onClick={() => setShowNotifications(true)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset relative"
              style={{ 
                color: 'var(--text-body)',
                focusRingColor: 'var(--color-brand)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                e.currentTarget.style.color = 'var(--text-heading)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-body)'
              }}
            >
              <i className="fas fa-bell text-xl" style={{ color: unreadCount > 0 ? '#FFD700' : 'var(--text-muted)' }}></i>
              {unreadCount > 0 && (
                <span 
                  className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 text-xs font-bold text-white rounded-full"
                  style={{ backgroundColor: 'var(--color-danger)' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-brand)' }}>
                <span className="text-sm font-medium text-white">{getUserInitials()}</span>
              </div>
              <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--text-body)' }}>{getDisplayName()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  )
}

export default Header
