import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Attendance() {
  const [attendance, setAttendance] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ studentId: '', courseId: '', date: '', present: true })
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { darkMode } = useTheme()

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [attendanceRes, studentsRes, coursesRes] = await Promise.all([
        api.get('/attendance'),
        api.get('/students'),
        api.get('/courses')
      ])
      setAttendance(attendanceRes.data)
      setStudents(studentsRes.data)
      setCourses(coursesRes.data)
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/attendance', {
        student: { id: form.studentId },
        course: { id: form.courseId },
        date: form.date,
        present: form.present === 'true' || form.present === true
      })
      setShowForm(false)
      setForm({ studentId: '', courseId: '', date: '', present: true })
      fetchAll()
    } catch (err) {
      const msg = err.response?.data || 'Failed to mark attendance'
      alert(msg)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this attendance record?')) {
      try {
        await api.delete(`/attendance/${id}`)
        fetchAll()
      } catch (err) {
        setError('Failed to delete attendance')
      }
    }
  }

  const exportCSV = () => {
    const headers = ['Student', 'Course', 'Date', 'Status']
    const rows = filteredAttendance.map(a => [
      a.student?.name || '',
      a.course?.name || '',
      a.date || '',
      a.present ? 'Present' : 'Absent'
    ])
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'attendance-report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredAttendance = attendance.filter(a =>
    a.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.course?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Attendance Tracking</h1>
        <button onClick={() => navigate('/admin')} className="bg-white text-blue-700 px-4 py-1 rounded-lg font-medium">Back</button>
      </nav>
      <div className="p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-between items-center mb-4 gap-4">
          <input
            placeholder="Search by student or course..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full max-w-md"
          />
          <div className="flex gap-2">
            <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 whitespace-nowrap">
              📊 Export CSV
            </button>
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap">
              {showForm ? 'Cancel' : '+ Mark Attendance'}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className={`p-6 rounded-xl shadow mb-6 grid grid-cols-2 gap-4 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <select value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
            <select value={form.present} onChange={e => setForm({...form, present: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
              <option value={true}>Present</option>
              <option value={false}>Absent</option>
            </select>
            <button type="submit" className="col-span-2 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700">Save</button>
          </form>
        )}

        {loading ? <p>Loading...</p> : (
          <div className={`rounded-xl shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
              Showing {filteredAttendance.length} of {attendance.length} records
            </div>
            <table className="w-full text-sm">
              <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                <tr>
                  <th className="px-6 py-3 text-left">Student</th>
                  <th className="px-6 py-3 text-left">Course</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No attendance records found</td></tr>
                ) : filteredAttendance.map(a => (
                  <tr key={a.id} className={`border-t ${darkMode ? 'hover:bg-gray-700 text-gray-200 border-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">{a.student?.name}</td>
                    <td className="px-6 py-4">{a.course?.name}</td>
                    <td className="px-6 py-4">{a.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${a.present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {a.present ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}