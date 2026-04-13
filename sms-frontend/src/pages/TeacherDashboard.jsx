import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function TeacherDashboard() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const { darkMode } = useTheme()
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('courses')
  const [showGradeForm, setShowGradeForm] = useState(false)
  const [showAttendanceForm, setShowAttendanceForm] = useState(false)
  const [gradeForm, setGradeForm] = useState({ studentId: '', courseId: '', marks: '' })
  const [attendanceForm, setAttendanceForm] = useState({ studentId: '', courseId: '', date: '', present: true })
  const [teacherName, setTeacherName] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  const getEmailFromToken = () => {
    try {
      const payload = JSON.parse(atob(user.token.split('.')[1]))
      return payload.sub
    } catch {
      return null
    }
  }

  const fetchAll = async () => {
    try {
      const email = getEmailFromToken()
      const [coursesRes, studentsRes, gradesRes, attendanceRes] = await Promise.all([
        api.get('/courses'),
        api.get('/students'),
        api.get('/grades'),
        api.get('/attendance')
      ])
      setCourses(coursesRes.data)
      setStudents(studentsRes.data)
      setGrades(gradesRes.data)
      setAttendance(attendanceRes.data)
      if (email) {
        const name = email.split('@')[0]
        setTeacherName(name)
      }
    } catch (err) {
      console.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleGradeSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/grades', {
        student: { id: gradeForm.studentId },
        course: { id: gradeForm.courseId },
        marks: parseFloat(gradeForm.marks)
      })
      alert('Grade submitted successfully!')
      setShowGradeForm(false)
      setGradeForm({ studentId: '', courseId: '', marks: '' })
      fetchAll()
    } catch (err) {
      const msg = err.response?.data || 'Failed to submit grade'
      alert(msg)
    }
  }

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/attendance', {
        student: { id: attendanceForm.studentId },
        course: { id: attendanceForm.courseId },
        date: attendanceForm.date,
        present: attendanceForm.present === 'true' || attendanceForm.present === true
      })
      alert('Attendance marked successfully!')
      setShowAttendanceForm(false)
      setAttendanceForm({ studentId: '', courseId: '', date: '', present: true })
      fetchAll()
    } catch (err) {
      const msg = err.response?.data || 'Failed to mark attendance'
      alert(msg)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">SMS — Teacher Dashboard</h1>
          <p className="text-green-200 text-sm">Welcome, {teacherName}</p>
        </div>
        <button onClick={handleLogout} className={`px-4 py-1 rounded-lg font-medium ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-green-700 hover:bg-gray-100'}`}>Logout</button>
      </nav>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`rounded-xl shadow p-4 text-center ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <p className="text-gray-400 text-sm">Total Courses</p>
            <p className="text-2xl font-bold text-green-600">{courses.length}</p>
          </div>
          <div className={`rounded-xl shadow p-4 text-center ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <p className="text-gray-400 text-sm">Total Students</p>
            <p className="text-2xl font-bold text-green-600">{students.length}</p>
          </div>
          <div className={`rounded-xl shadow p-4 text-center ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <p className="text-gray-400 text-sm">Grades Submitted</p>
            <p className="text-2xl font-bold text-green-600">{grades.length}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <button onClick={() => setActiveTab('courses')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'courses' ? 'bg-green-600 text-white' : darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-700'}`}>Courses</button>
          <button onClick={() => setActiveTab('students')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'students' ? 'bg-green-600 text-white' : darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-700'}`}>Students</button>
          <button onClick={() => setActiveTab('grades')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'grades' ? 'bg-green-600 text-white' : darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-700'}`}>Grades</button>
          <button onClick={() => setActiveTab('attendance')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'attendance' ? 'bg-green-600 text-white' : darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-700'}`}>Attendance</button>
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

            {activeTab === 'students' && (
              <div className={`rounded-xl shadow overflow-hidden ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
                <table className="w-full text-sm">
                  <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Roll No</th>
                      <th className="px-6 py-3 text-left">Department</th>
                      <th className="px-6 py-3 text-left">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id} className={`border-t ${darkMode ? 'hover:bg-gray-700 text-gray-200 border-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4">{s.name}</td>
                        <td className="px-6 py-4">{s.email}</td>
                        <td className="px-6 py-4">{s.rollNumber}</td>
                        <td className="px-6 py-4">{s.department}</td>
                        <td className="px-6 py-4">{s.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'grades' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Grade Records</h2>
                  <button onClick={() => setShowGradeForm(!showGradeForm)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    {showGradeForm ? 'Cancel' : '+ Submit Grade'}
                  </button>
                </div>

                {showGradeForm && (
                  <form onSubmit={handleGradeSubmit} className={`p-6 rounded-xl shadow mb-6 grid grid-cols-3 gap-4 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
                    <select value={gradeForm.studentId} onChange={e => setGradeForm({...gradeForm, studentId: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required>
                      <option value="">Select Student</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <select value={gradeForm.courseId} onChange={e => setGradeForm({...gradeForm, courseId: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required>
                      <option value="">Select Course</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input placeholder="Marks (0-100)" type="number" min="0" max="100" value={gradeForm.marks} onChange={e => setGradeForm({...gradeForm, marks: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
                    <button type="submit" className="col-span-3 bg-green-600 text-white rounded-lg py-2 hover:bg-green-700">Submit Grade</button>
                  </form>
                )}

                <div className={`rounded-xl shadow overflow-hidden ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
                  <table className="w-full text-sm">
                    <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                      <tr>
                        <th className="px-6 py-3 text-left">Student</th>
                        <th className="px-6 py-3 text-left">Course</th>
                        <th className="px-6 py-3 text-left">Marks</th>
                        <th className="px-6 py-3 text-left">Grade</th>
                        <th className="px-6 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No grades yet</td></tr>
                      ) : grades.map(g => (
                        <tr key={g.id} className={`border-t ${darkMode ? 'hover:bg-gray-700 text-gray-200 border-gray-700' : 'hover:bg-gray-50'}`}>
                          <td className="px-6 py-4">{g.student?.name}</td>
                          <td className="px-6 py-4">{g.course?.name}</td>
                          <td className="px-6 py-4">{g.marks}</td>
                          <td className="px-6 py-4 font-bold">{g.grade}</td>
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
              </div>
            )}

            {activeTab === 'attendance' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Attendance Records</h2>
                  <button onClick={() => setShowAttendanceForm(!showAttendanceForm)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    {showAttendanceForm ? 'Cancel' : '+ Mark Attendance'}
                  </button>
                </div>

                {showAttendanceForm && (
                  <form onSubmit={handleAttendanceSubmit} className={`p-6 rounded-xl shadow mb-6 grid grid-cols-2 gap-4 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
                    <select value={attendanceForm.studentId} onChange={e => setAttendanceForm({...attendanceForm, studentId: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required>
                      <option value="">Select Student</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <select value={attendanceForm.courseId} onChange={e => setAttendanceForm({...attendanceForm, courseId: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required>
                      <option value="">Select Course</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="date" value={attendanceForm.date} onChange={e => setAttendanceForm({...attendanceForm, date: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
                    <select value={attendanceForm.present} onChange={e => setAttendanceForm({...attendanceForm, present: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                      <option value={true}>Present</option>
                      <option value={false}>Absent</option>
                    </select>
                    <button type="submit" className="col-span-2 bg-green-600 text-white rounded-lg py-2 hover:bg-green-700">Mark Attendance</button>
                  </form>
                )}

                <div className={`rounded-xl shadow overflow-hidden ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
                  <table className="w-full text-sm">
                    <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                      <tr>
                        <th className="px-6 py-3 text-left">Student</th>
                        <th className="px-6 py-3 text-left">Course</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No attendance records yet</td></tr>
                      ) : attendance.map(a => (
                        <tr key={a.id} className={`border-t ${darkMode ? 'hover:bg-gray-700 text-gray-200 border-gray-700' : 'hover:bg-gray-50'}`}>
                          <td className="px-6 py-4">{a.student?.name}</td>
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}