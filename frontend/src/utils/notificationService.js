// Notification Service - Centralized notification management

class NotificationService {
  constructor() {
    this.notificationHistory = this.loadHistory()
    this.sounds = {
      success: '/sounds/success.mp3',
      warning: '/sounds/warning.mp3',
      info: '/sounds/info.mp3',
      error: '/sounds/error.mp3'
    }
  }

  // Load notification history from localStorage
  loadHistory() {
    const history = localStorage.getItem('notificationHistory')
    return history ? JSON.parse(history) : []
  }

  // Save notification to history
  saveToHistory(notification) {
    const historyItem = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    }
    
    this.notificationHistory.unshift(historyItem)
    
    // Keep only last 50 notifications
    if (this.notificationHistory.length > 50) {
      this.notificationHistory = this.notificationHistory.slice(0, 50)
    }
    
    localStorage.setItem('notificationHistory', JSON.stringify(this.notificationHistory))
    
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('notificationAdded', { detail: historyItem }))
    
    return historyItem
  }

  // Get all notifications
  getHistory() {
    return this.notificationHistory
  }

  // Get unread count
  getUnreadCount() {
    return this.notificationHistory.filter(n => !n.read).length
  }

  // Mark notification as read
  markAsRead(id) {
    const notification = this.notificationHistory.find(n => n.id === id)
    if (notification) {
      notification.read = true
      localStorage.setItem('notificationHistory', JSON.stringify(this.notificationHistory))
      window.dispatchEvent(new CustomEvent('notificationRead', { detail: id }))
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notificationHistory.forEach(n => n.read = true)
    localStorage.setItem('notificationHistory', JSON.stringify(this.notificationHistory))
    window.dispatchEvent(new CustomEvent('allNotificationsRead'))
  }

  // Clear all history
  clearHistory() {
    this.notificationHistory = []
    localStorage.removeItem('notificationHistory')
    window.dispatchEvent(new CustomEvent('notificationsCleared'))
  }

  // Play notification sound
  playSound(type = 'info') {
    const settings = JSON.parse(localStorage.getItem('appSettings') || '{}')
    if (settings.notificationSounds !== false) {
      try {
        const audio = new Audio(this.sounds[type] || this.sounds.info)
        audio.volume = 0.5
        audio.play().catch(err => console.log('Audio play failed:', err))
      } catch (err) {
        console.log('Audio not available')
      }
    }
  }

  // Check if notifications are enabled
  isEnabled() {
    const settings = JSON.parse(localStorage.getItem('appSettings') || '{}')
    return settings.notifications === true && Notification.permission === 'granted'
  }

  // Send browser notification
  async send({ title, body, icon, type = 'info', tag, data }) {
    if (!this.isEnabled()) {
      console.log('Notifications not enabled')
      return null
    }

    try {
      // Play sound
      this.playSound(type)

      // Save to history
      const historyItem = this.saveToHistory({
        title,
        body,
        icon,
        type,
        tag,
        data
      })

      // Send browser notification
      const notification = new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: tag || `notification-${Date.now()}`,
        requireInteraction: type === 'warning' || type === 'error',
        data: data
      })

      notification.onclick = () => {
        window.focus()
        this.markAsRead(historyItem.id)
        notification.close()
        
        // Handle click action if data provided
        if (data?.action) {
          window.dispatchEvent(new CustomEvent('notificationClicked', { detail: data }))
        }
      }

      return notification
    } catch (err) {
      console.error('Failed to send notification:', err)
      return null
    }
  }

  // Transaction notification
  transactionAdded(transaction) {
    const type = transaction.type === 'income' ? 'success' : 'info'
    const emoji = transaction.type === 'income' ? '💰' : '💸'
    
    return this.send({
      title: `${emoji} New ${transaction.type === 'income' ? 'Income' : 'Expense'}`,
      body: `${transaction.description}: $${Math.abs(transaction.amount).toLocaleString()}`,
      type,
      tag: 'transaction',
      data: { action: 'viewTransaction', transactionId: transaction._id }
    })
  }

  // Budget alert notification
  budgetAlert(budget, spent, percentage) {
    const type = percentage >= 100 ? 'error' : 'warning'
    const emoji = percentage >= 100 ? '🚨' : '⚠️'
    
    return this.send({
      title: `${emoji} Budget Alert: ${budget.category}`,
      body: `You've used $${spent.toLocaleString()} of $${budget.limit.toLocaleString()} (${percentage}%)`,
      type,
      tag: `budget-${budget.category}`,
      data: { action: 'viewBudget', category: budget.category }
    })
  }

  // Weekly report notification
  weeklyReport(stats) {
    return this.send({
      title: '📊 Weekly Financial Report',
      body: `Income: $${stats.income.toLocaleString()} | Expenses: $${stats.expenses.toLocaleString()} | Net: $${stats.net.toLocaleString()}`,
      type: 'info',
      tag: 'weekly-report',
      data: { action: 'viewAnalytics' }
    })
  }

  // System notification
  systemNotification(message, type = 'info') {
    return this.send({
      title: 'Finance Tracker',
      body: message,
      type,
      tag: 'system'
    })
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
export default notificationService
