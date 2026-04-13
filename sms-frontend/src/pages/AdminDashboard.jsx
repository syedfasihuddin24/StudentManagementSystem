import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { darkMode } = useTheme()

  const cards = [
    { title: '👨‍🎓 Students', desc: 'Manage all students', path: '/admin/students', color: 'from-blue-500 to-blue-600', border: 'border-blue-500' },
    { title: '📚 Courses', desc: 'Manage all courses', path: '/admin/courses', color: 'from-green-500 to-green-600', border: 'border-green-500' },
    { title: '📝 Grades', desc: 'View and manage grades', path: '/admin/grades', color: 'from-yellow-500 to-orange-500', border: 'border-yellow-500' },
    { title: '📅 Attendance', desc: 'Track attendance records', path: '/admin/attendance', color: 'from-red-500 to-red-600', border: 'border-red-500' },
    { title: '📊 Analytics', desc: 'Charts and statistics', path: '/admin/dashboard', color: 'from-purple-500 to-purple-600', border: 'border-purple-500' },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar title="SMS — Admin Dashboard" color="blue" />
      <div className="p-6">
        <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Welcome back, Admin 👋
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              onClick={() => navigate(card.path)}
              className={`rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl border-l-4 ${card.border} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-md`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                {card.title.split(' ')[0]}
              </div>
              <h3 className="text-lg font-bold">{card.title.split(' ').slice(1).join(' ')}</h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}