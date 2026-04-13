import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { darkMode } = useTheme()
  const [profile, setProfile] = useState(null)
  const [studentInfo, setStudentInfo] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', department: '', year: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const getEmailFromToken = () => {
    try {
      const payload = JSON.parse(atob(user.token.split('.')[1]))
      return payload.sub
    } catch { return null }
  }

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    try {
      const email = getEmailFromToken()
      const studentsRes = await api.get('/students')
      const myStudent = studentsRes.data.find(s => s.email === email)
      if (myStudent) {
        setStudentInfo(myStudent)
        setForm({
          name: myStudent.name || '',
          email: myStudent.email || '',
          department: myStudent.department || '',
          year: myStudent.year || ''
        })
      } else {
        setForm({ name: email?.split('@')[0] || '', email: email || '', department: '', year: '' })
      }
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      if (studentInfo) {
        await api.put(`/students/${studentInfo.id}`, {
          name: form.name,
          email: form.email,
          rollNumber: studentInfo.rollNumber,
          department: form.department,
          year: parseInt(form.year)
        })
      }
      setMessage('Profile updated successfully!')
      setEditing(false)
      fetchProfile()
    } catch (err) {
      setError('Failed to update profile')
    }
  }

  const getRoleColor = () => {
    if (user.role === 'ADMIN') return 'bg-blue-100 text-blue-700'
    if (user.role === 'TEACHER') return 'bg-green-100 text-green-700'
    return 'bg-purple-100 text-purple-700'
  }

  const getInitials = () => {
    return form.name ? form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??'
  }

  const handleBack = () => {
    if (user.role === 'ADMIN') navigate('/admin')
    else if (user.role === 'TEACHER') navigate('/teacher')
    else navigate('/student')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">My Profile</h1>
        <button onClick={handleBack} className="bg-white text-blue-700 px-4 py-1 rounded-lg font-medium">Back</button>
      </nav>

      <div className="p-6 max-w-2xl mx-auto">
        {message && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {getInitials()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{form.name}</h2>
              <p className="text-gray-500">{form.email}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor()}`}>
                {user.role}
              </span>
            </div>
          </div>

          {studentInfo && (
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Roll Number</p>
                <p className="font-medium">{studentInfo.rollNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="font-medium">{studentInfo.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Year</p>
                <p className="font-medium">{studentInfo.year ? `${studentInfo.year} Year` : 'N/A'}</p>
              </div>
            </div>
          )}

          {!editing ? (
            <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Edit Profile
            </button>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2" required />
              </div>
              {studentInfo && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <select value={form.year} onChange={e => setForm({...form, year: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2">
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </>
              )}
              <div className="flex gap-3">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => setEditing(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Change Password</h3>
            <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="text-blue-600 text-sm hover:underline">
              {showPasswordForm ? 'Cancel' : 'Change'}
            </button>
          </div>
          {showPasswordForm && (
            <form onSubmit={(e) => {
              e.preventDefault()
              if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                alert('Passwords do not match!')
                return
              }
              if (passwordForm.newPassword.length < 6) {
                alert('Password must be at least 6 characters!')
                return
              }
              alert('Password change feature requires backend implementation. Coming soon!')
              setShowPasswordForm(false)
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2" placeholder="Min 6 characters" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2" placeholder="Repeat new password" required />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Update Password</button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => { logout(); navigate('/login') }}
            className="text-red-500 hover:text-red-700 text-sm font-medium">
            Logout from all devices
          </button>
        </div>
      </div>
    </div>
  )
}