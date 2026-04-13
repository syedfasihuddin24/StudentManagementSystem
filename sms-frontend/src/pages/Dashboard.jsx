import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend } from 'recharts'
import api from '../services/api'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function Dashboard() {
  const navigate = useNavigate()
  const { darkMode } = useTheme()
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [s, c, g, a] = await Promise.all([
        api.get('/students'),
        api.get('/courses'),
        api.get('/grades'),
        api.get('/attendance')
      ])
      setStudents(s.data)
      setCourses(c.data)
      setGrades(g.data)
      setAttendance(a.data)
    } catch (err) {
      console.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const passFailData = [
    { name: 'Passed', value: grades.filter(g => g.passed).length },
    { name: 'Failed', value: grades.filter(g => !g.passed).length }
  ]

  const gradeDistribution = ['A+', 'A', 'B', 'C', 'D', 'F'].map(grade => ({
    grade,
    count: grades.filter(g => g.grade === grade).length
  }))

  const departmentData = [...new Set(students.map(s => s.department).filter(Boolean))].map(dept => ({
    department: dept,
    students: students.filter(s => s.department === dept).length
  }))

  const attendanceData = [
    { name: 'Present', value: attendance.filter(a => a.present).length },
    { name: 'Absent', value: attendance.filter(a => !a.present).length }
  ]

  const avgGpa = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.gpa, 0) / grades.length).toFixed(2)
    : 0

  const passRate = grades.length > 0
    ? ((grades.filter(g => g.passed).length / grades.length) * 100).toFixed(1)
    : 0

  const attendanceRate = attendance.length > 0
    ? ((attendance.filter(a => a.present).length / attendance.length) * 100).toFixed(1)
    : 0

  // Custom Tooltip for Grade Distribution
  const GradeTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = gradeDistribution.reduce((sum, item) => sum + item.count, 0)
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-medium">{`Grade: ${label}`}</p>
          <p className="text-blue-600">{`Count: ${payload[0].value}`}</p>
          <p className="text-gray-600">{`Percentage: ${percentage}%`}</p>
        </div>
      )
    }
    return null
  }

  // Custom Tooltip for Department Distribution
  const DepartmentTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = departmentData.reduce((sum, item) => sum + item.students, 0)
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-medium">{`Department: ${label}`}</p>
          <p className="text-purple-600">{`Students: ${payload[0].value}`}</p>
          <p className="text-gray-600">{`Percentage: ${percentage}%`}</p>
        </div>
      )
    }
    return null
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">SMS — Analytics Dashboard</h1>
        <button onClick={() => navigate('/admin')} className="bg-white text-blue-700 px-4 py-1 rounded-lg font-medium">Back</button>
      </nav>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Total Students</p>
            <p className="text-3xl font-bold text-blue-600">{students.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-green-600">{courses.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Average GPA</p>
            <p className="text-3xl font-bold text-purple-600">{avgGpa}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Pass Rate</p>
            <p className="text-3xl font-bold text-amber-600">{passRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Grade Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Grade Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip content={<GradeTooltip />} />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pass/Fail Pie */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Pass / Fail Rate</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={passFailData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={70} 
                  dataKey="value" 
                  label={({ value, percent }) => `${(percent * 100).toFixed(1)}%`}
                  labelLine={true}
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={index} fill={index === 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Department Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Students by Department</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip content={<DepartmentTooltip />} />
                <Bar dataKey="students" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Pie */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Attendance Overview ({attendanceRate}%)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={attendanceData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={70} 
                  dataKey="value" 
                  label={({ value, percent }) => `${(percent * 100).toFixed(1)}%`}
                  labelLine={true}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={index} fill={index === 0 ? '#3B82F6' : '#F59E0B'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}