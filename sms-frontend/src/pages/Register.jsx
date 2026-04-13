import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'

export default function Register() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    rollNumber: '', department: '', year: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { darkMode } = useTheme()

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters!')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: role,
        rollNumber: form.rollNumber,
        department: form.department,
        year: form.year
      })

      alert('Account created successfully! Please login.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex flex-col items-center justify-center p-4`}>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">Create Account</h1>
        <p className="text-center text-gray-500 mb-6">Student Management System</p>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-center text-gray-600 font-medium mb-4">I am a...</p>
            <button
              onClick={() => handleRoleSelect('STUDENT')}
              className="w-full border-2 border-blue-500 text-blue-700 py-4 rounded-xl hover:bg-blue-50 transition font-medium text-lg"
            >
              👨‍🎓 Student
            </button>
            <button
              onClick={() => handleRoleSelect('TEACHER')}
              className="w-full border-2 border-green-500 text-green-700 py-4 rounded-xl hover:bg-green-50 transition font-medium text-lg"
            >
              👨‍🏫 Teacher
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <span onClick={() => navigate('/login')} className="text-blue-600 cursor-pointer hover:underline">Sign In</span>
            </p>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700">← Back</button>
              <span className="text-sm font-medium text-gray-600">
                {role === 'STUDENT' ? '👨‍🎓 Student' : '👨‍🏫 Teacher'} Registration
              </span>
            </div>

            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email" required />
            </div>

            {role === 'STUDENT' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input type="text" value={form.rollNumber} onChange={e => setForm({...form, rollNumber: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your roll number" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Computer Science" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select value={form.year} onChange={e => setForm({...form, year: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min 6 characters" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Repeat your password" required />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <span onClick={() => navigate('/login')} className="text-blue-600 cursor-pointer hover:underline font-medium">Sign In</span>
            </p>
          </form>
        )}
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Built by <span className="font-semibold text-blue-600">Syed Fasihuddin</span>
      </p>
    </div>
  )
}