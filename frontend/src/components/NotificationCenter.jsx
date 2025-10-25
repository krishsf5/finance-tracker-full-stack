import { useState, useEffect } from 'react'
import notificationService from '../utils/notificationService'

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all') // all, unread, read

  useEffect(() => {
    loadNotifications()

    // Listen for new notifications
    const handleNewNotification = () => loadNotifications()
    const handleRead = () => loadNotifications()
    const handleCleared = () => loadNotifications()

    window.addEventListener('notificationAdded', handleNewNotification)
    window.addEventListener('notificationRead', handleRead)
    window.addEventListener('allNotificationsRead', handleRead)
    window.addEventListener('notificationsCleared', handleCleared)

    return () => {
      window.removeEventListener('notificationAdded', handleNewNotification)
      window.removeEventListener('notificationRead', handleRead)
      window.removeEventListener('allNotificationsRead', handleRead)
      window.removeEventListener('notificationsCleared', handleCleared)
    }
  }, [])

  const loadNotifications = () => {
    setNotifications(notificationService.getHistory())
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'read') return n.read
    return true
  })

  const handleMarkAsRead = (id) => {
    notificationService.markAsRead(id)
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead()
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      notificationService.clearHistory()
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now - then
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div 
        className="fixed right-0 top-0 h-full w-full sm:w-96 shadow-2xl z-50 transform transition-transform duration-300"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            style={{ color: 'var(--text-muted)' }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Filter Tabs */}
        <div 
          className="flex gap-2 p-4 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-blue-500 text-white' : ''
            }`}
            style={{
              backgroundColor: filter === 'all' ? 'var(--color-brand)' : 'transparent',
              color: filter === 'all' ? 'white' : 'var(--text-body)'
            }}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
            style={{
              backgroundColor: filter === 'unread' ? 'var(--color-brand)' : 'transparent',
              color: filter === 'unread' ? 'white' : 'var(--text-body)'
            }}
          >
            Unread ({notificationService.getUnreadCount()})
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div 
            className="flex gap-2 p-4 border-b"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm"
              style={{ color: 'var(--color-brand)' }}
            >
              Mark all as read
            </button>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <button
              onClick={handleClearAll}
              className="text-sm"
              style={{ color: 'var(--color-danger)' }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Notification List */}
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 180px)' }}>
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <i 
                className="fas fa-bell-slash text-6xl mb-4"
                style={{ color: 'var(--text-muted)' }}
              ></i>
              <p className="text-lg font-medium" style={{ color: 'var(--text-heading)' }}>
                No notifications
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                {filter === 'unread' 
                  ? "You're all caught up!"
                  : "Notifications will appear here"}
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  style={{
                    backgroundColor: !notification.read ? 'var(--hover-bg)' : 'transparent'
                  }}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 text-2xl">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p 
                          className="font-semibold text-sm"
                          style={{ color: 'var(--text-heading)' }}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div 
                            className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                            style={{ backgroundColor: 'var(--color-brand)' }}
                          ></div>
                        )}
                      </div>
                      <p 
                        className="text-sm mt-1"
                        style={{ color: 'var(--text-body)' }}
                      >
                        {notification.body}
                      </p>
                      <p 
                        className="text-xs mt-2"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {getTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NotificationCenter
