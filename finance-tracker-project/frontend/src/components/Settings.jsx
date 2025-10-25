import { useState } from 'react'

const Settings = ({ darkMode, onToggleDarkMode }) => {
  const [settings, setSettings] = useState({
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    notifications: true,
    autoBackup: true,
    budgetAlerts: true,
    emailReports: false
  })

  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match!')
      return
    }
    if (passwords.new.length < 8) {
      alert('Password must be at least 8 characters long!')
      return
    }
    alert('Password changed successfully!')
    setPasswords({ current: '', new: '', confirm: '' })
    setShowChangePassword(false)
  }

  const handleExportData = () => {
    // In a real app, this would export actual data
    const dataStr = JSON.stringify({ message: 'Export functionality would be implemented here' }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'finance-data-export.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Settings</h2>
        <p className="mt-1" style={{ color: 'var(--text-body)' }}>Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          <div 
            className="rounded-xl shadow-sm border p-6"
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-color)',
              boxShadow: '0 1px 3px var(--shadow-color)'
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Account Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>Email</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>user@example.com</p>
                </div>
                <button 
                  className="px-4 py-2 text-sm font-medium"
                  style={{ color: 'var(--color-brand)' }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Change
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>Password</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>••••••••</p>
                </div>
                <button 
                  onClick={() => setShowChangePassword(true)}
                  className="px-4 py-2 text-sm font-medium"
                  style={{ color: 'var(--color-brand)' }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div 
            className="rounded-xl shadow-sm border p-6"
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-color)',
              boxShadow: '0 1px 3px var(--shadow-color)'
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Preferences</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-body)' }}>Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-2 focus:border-2"
                  style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-body)',
                    focusRingColor: 'var(--color-brand)',
                    focusBorderColor: 'var(--color-brand)'
                  }}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-body)' }}>Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-2 focus:border-2"
                  style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-body)',
                    focusRingColor: 'var(--color-brand)',
                    focusBorderColor: 'var(--color-brand)'
                  }}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>Dark Mode</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Switch to dark theme</p>
                  </div>
                  <button
                    onClick={onToggleDarkMode}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    style={{
                      backgroundColor: darkMode ? 'var(--color-brand)' : 'var(--border-color)'
                    }}
                  >
                    <span
                      className="inline-block h-4 w-4 transform rounded-full transition-transform"
                      style={{
                        backgroundColor: 'white',
                        transform: darkMode ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                      }}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>Auto Backup</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Automatically backup your data</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('autoBackup', !settings.autoBackup)}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    style={{
                      backgroundColor: settings.autoBackup ? 'var(--color-brand)' : 'var(--border-color)'
                    }}
                  >
                    <span
                      className="inline-block h-4 w-4 transform rounded-full transition-transform"
                      style={{
                        backgroundColor: 'white',
                        transform: settings.autoBackup ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div 
            className="rounded-xl shadow-sm border p-6"
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-color)',
              boxShadow: '0 1px 3px var(--shadow-color)'
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>Push Notifications</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Receive notifications for important updates</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', !settings.notifications)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{
                    backgroundColor: settings.notifications ? 'var(--color-brand)' : 'var(--border-color)'
                  }}
                >
                  <span
                    className="inline-block h-4 w-4 transform rounded-full transition-transform"
                    style={{
                      backgroundColor: 'white',
                      transform: settings.notifications ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>Budget Alerts</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Get notified when approaching budget limits</p>
                </div>
                <button
                  onClick={() => handleSettingChange('budgetAlerts', !settings.budgetAlerts)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{
                    backgroundColor: settings.budgetAlerts ? 'var(--color-brand)' : 'var(--border-color)'
                  }}
                >
                  <span
                    className="inline-block h-4 w-4 transform rounded-full transition-transform"
                    style={{
                      backgroundColor: 'white',
                      transform: settings.budgetAlerts ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>Email Reports</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Receive weekly financial reports via email</p>
                </div>
                <button
                  onClick={() => handleSettingChange('emailReports', !settings.emailReports)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{
                    backgroundColor: settings.emailReports ? 'var(--color-brand)' : 'var(--border-color)'
                  }}
                >
                  <span
                    className="inline-block h-4 w-4 transform rounded-full transition-transform"
                    style={{
                      backgroundColor: 'white',
                      transform: settings.emailReports ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div 
            className="rounded-xl shadow-sm border p-6"
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-color)',
              boxShadow: '0 1px 3px var(--shadow-color)'
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors"
                style={{ 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-body)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--hover-bg)'
                  e.target.style.color = 'var(--text-heading)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = 'var(--text-body)'
                }}
              >
                <i className="fas fa-download mr-2"></i>
                Export Data
              </button>
              
              <button 
                className="w-full flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors"
                style={{ 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-body)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--hover-bg)'
                  e.target.style.color = 'var(--text-heading)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = 'var(--text-body)'
                }}
              >
                <i className="fas fa-upload mr-2"></i>
                Import Data
              </button>
              
              <button 
                className="w-full flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors"
                style={{ 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-body)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--hover-bg)'
                  e.target.style.color = 'var(--text-heading)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = 'var(--text-body)'
                }}
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Sync Data
              </button>
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
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Account Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Member since:</span>
                <span style={{ color: 'var(--text-heading)' }}>Jan 2024</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Last login:</span>
                <span style={{ color: 'var(--text-heading)' }}>Today</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Data usage:</span>
                <span style={{ color: 'var(--text-heading)' }}>2.3 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowChangePassword(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handlePasswordChange}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                        required
                        minLength="8"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
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

export default Settings
