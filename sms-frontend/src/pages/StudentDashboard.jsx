import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function StudentDashboard() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const { darkMode } = useTheme()
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [courses, setCourses] = useState([])
  const [studentInfo, setStudentInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('courses')

  const getEmailFromToken = () => {
    try {
      const payload = JSON.parse(atob(user.token.split('.')[1]))
      return payload.sub
    } catch {
      return null
    }
  }

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      const email = getEmailFromToken()
      const studentsRes = await api.get('/students')
      const myStudent = studentsRes.data.find(s => s.email === email)

      if (myStudent) {
        setStudentInfo(myStudent)
        const [gradesRes, attendanceRes] = await Promise.all([
          api.get(`/grades/student/${myStudent.id}`),
          api.get(`/attendance/student/${myStudent.id}`)
        ])
        setGrades(gradesRes.data)
        setAttendance(attendanceRes.data)
      }

      const coursesRes = await api.get('/courses')
      setCourses(coursesRes.data)
    } catch (err) {
      console.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const avgGpa = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.gpa, 0) / grades.length).toFixed(2)
    : 'N/A'

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <nav className="bg-purple-700 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">SMS — Student Dashboard</h1>
          {studentInfo && <p className="text-purple-200 text-sm">Welcome, {studentInfo.name} | {studentInfo.rollNumber}</p>}
        </div>
        <button onClick={handleLogout} className={`px-4 py-1 rounded-lg font-medium ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-purple-700 hover:bg-gray-100'}`}>Logout</button>
      </nav>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`rounded-xl shadow p-4 text-center ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <p className="text-sm text-gray-400">Total Courses</p>
            <p className="text-2xl font-bold text-purple-400">{courses.length}</p>
          </div>
          <div className={`rounded-xl shadow p-4 text-center ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <p className="text-sm text-gray-400">My Average GPA</p>
            <p className="text-2xl font-bold text-purple-400">{avgGpa}</p>
          </div>
          <div className={`rounded-xl shadow p-4 text-center ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <p className="text-sm text-gray-400">My Attendance</p>
            <p className="text-2xl font-bold text-purple-400">{attendance.length}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('courses')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'courses' ? 'bg-purple-600 text-white' : darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-700'}`}>All Courses</button>
          <button onClick={() => setActiveTab('grades')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'grades' ? 'bg-purple-600 text-white' : darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-700'}`}>My Grades</button>
          <button onClick={() => setActiveTab('attendance')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'attendance' ? 'bg-purple-600 text-white' : darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-700'}`}>My Attendance</button>
        </div>

        {loading ? <p>Loading...</p> : (
          <>
            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map(c => (
                  <div key={c.id} className={`rounded-xl shadow p-6 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
                    <h2 className="text-lg font-semibold">{c.name}</h2>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Code: {c.code}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Department: {c.department}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Credits: {c.credits}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'grades' && (
              <div className={`rounded-xl shadow overflow-hidden ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
                <table className="w-full text-sm">
                  <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left">Course</th>
                      <th className="px-6 py-3 text-left">Marks</th>
                      <th className="px-6 py-3 text-left">Grade</th>
                      <th className="px-6 py-3 text-left">GPA</th>
                      <th className="px-6 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No grades yet</td></tr>
                    ) : grades.map(g => (
                      <tr key={g.id} className={`border-t ${darkMode ? 'hover:bg-gray-700 text-gray-200 border-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4">{g.course?.name}</td>
                        <td className="px-6 py-4">{g.marks}</td>
                        <td className="px-6 py-4 font-bold">{g.grade}</td>
                        <td className="px-6 py-4">{g.gpa}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${g.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {g.passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className={`rounded-xl shadow overflow-hidden ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
                <table className="w-full text-sm">
                  <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left">Course</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.length === 0 ? (
                      <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No attendance records yet</td></tr>
                    ) : attendance.map(a => (
                      <tr key={a.id} className={`border-t ${darkMode ? 'hover:bg-gray-700 text-gray-200 border-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4">{a.course?.name}</td>
                        <td className="px-6 py-4">{a.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${a.present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {a.present ? 'Present' : 'Absent'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}