import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      const token = res.data.token
      const payload = JSON.parse(atob(token.split('.')[1]))
      const role = payload.role
      login(token, role)
      if (role === 'ADMIN') navigate('/admin')
      else if (role === 'TEACHER') navigate('/teacher')
      else navigate('/student')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <button onClick={toggleDarkMode} className="absolute top-4 right-4 text-2xl hover:scale-110 transition-transform">
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className={`w-full max-w-md rounded-2xl shadow-2xl p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
            SMS
          </div>
          <h1 className="text-2xl font-bold">Student Management System</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'}`}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'}`}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className={`text-center text-sm mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} className="text-blue-500 cursor-pointer hover:underline font-medium">
            Sign Up
          </span>
        </p>
      </div>

      <p className={`mt-6 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Built by <span className="font-semibold text-blue-500">Syed Fasihuddin</span> — Gates Institute of Technology
      </p>
    </div>
  )
}