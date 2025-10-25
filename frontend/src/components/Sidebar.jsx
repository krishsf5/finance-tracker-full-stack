import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  
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
    return user.name || 'User'
  }
  
  // Get email
  const getUserEmail = () => {
    if (!user) return 'user@example.com'
    return user.email || 'user@example.com'
  }
  
  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      dispatch(logout())
    }
  }
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z', path: 'M9 12l2 2 4-4' },
    { id: 'transactions', name: 'Transactions', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', path: 'M9 12l2 2 4-4' },
    { id: 'analytics', name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', path: 'M9 12l2 2 4-4' },
    { id: 'settings', name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', path: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-80 shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-0 lg:w-64
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="flex flex-col h-full pt-16 lg:pt-0">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
                style={{
                  backgroundColor: activeTab === item.id ? 'var(--hover-bg)' : 'transparent',
                  color: activeTab === item.id ? 'var(--color-brand)' : 'var(--text-body)',
                  borderRight: activeTab === item.id ? '2px solid var(--color-brand)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== item.id) {
                    e.target.style.backgroundColor = 'var(--hover-bg)'
                    e.target.style.color = 'var(--text-heading)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.id) {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.color = 'var(--text-body)'
                  }
                }}
              >
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.name}
              </button>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-brand)' }}>
                <span className="text-sm font-medium text-white">{getUserInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-heading)' }}>{getDisplayName()}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{getUserEmail()}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="mt-4 w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors"
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
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
