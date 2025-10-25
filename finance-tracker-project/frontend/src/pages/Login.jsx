import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/slices/authSlice'

const Login = ({ onSwitchToRegister }) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.auth)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(login(formData)).unwrap()
      // AppWithRedux will handle the redirect via isAuthenticated
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: 'var(--text-heading)' }}>
            Finance Tracker
          </h2>
          <p className="mt-2 text-center text-sm" style={{ color: 'var(--text-body)' }}>
            Sign in to your account
          </p>
        </div>
        <div className="mt-8 rounded-xl shadow-sm border p-8" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-body)' }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-body)',
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-body)' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-body)',
                }}
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: loading ? '#9CA3AF' : 'var(--color-brand)',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--border-color)' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={onSwitchToRegister}
                className="w-full flex justify-center py-2 px-4 border rounded-lg shadow-sm text-sm font-medium"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--color-brand)',
                  backgroundColor: 'transparent'
                }}
              >
                Create a new account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
