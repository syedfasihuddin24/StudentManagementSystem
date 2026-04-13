import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar({ title, backPath, color = 'blue' }) {
  const { logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()

  const colors = {
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    purple: 'from-purple-600 to-purple-800',
  }

  return (
    <nav className={`bg-gradient-to-r ${colors[color]} text-white px-6 py-4 flex justify-between items-center shadow-lg`}>
      <div className="flex items-center gap-3">
        {backPath && (
          <button onClick={() => navigate(backPath)} className="hover:bg-white/20 p-1 rounded-lg transition">
            ←
          </button>
        )}
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="hover:bg-white/20 p-2 rounded-lg transition text-lg"
          title="Toggle Dark Mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="hover:bg-white/20 px-3 py-1 rounded-lg transition text-sm font-medium"
        >
          👤 Profile
        </button>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-lg font-medium transition text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}