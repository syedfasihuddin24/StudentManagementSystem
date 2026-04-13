import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Grades() {
  const [grades, setGrades] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ studentId: '', courseId: '', marks: '' })
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { darkMode } = useTheme()

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [gradesRes, studentsRes, coursesRes] = await Promise.all([
        api.get('/grades'),
        api.get('/students'),
        api.get('/courses')
      ])
      setGrades(gradesRes.data)
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
      await api.post('/grades', {
        student: { id: form.studentId },
        course: { id: form.courseId },
        marks: parseFloat(form.marks)
      })
      setShowForm(false)
      setForm({ studentId: '', courseId: '', marks: '' })
      fetchAll()
    } catch (err) {
      const msg = err.response?.data || 'Failed to save grade'
      alert(msg)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this grade?')) {
      try {
        await api.delete(`/grades/${id}`)
        fetchAll()
      } catch (err) {
        setError('Failed to delete grade')
      }
    }
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Student Grade Report', 14, 22)
    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)
    doc.text(`Total Records: ${filteredGrades.length}`, 14, 37)

    autoTable(doc, {
      startY: 45,
      head: [['Student', 'Course', 'Marks', 'Grade', 'GPA', 'Status']],
      body: filteredGrades.map(g => [
        g.student?.name || '',
        g.course?.name || '',
        g.marks,
        g.grade,
        g.gpa,
        g.passed ? 'Passed' : 'Failed'
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [239, 246, 255] }
    })

    doc.save('grade-report.pdf')
  }

  const filteredGrades = grades.filter(g =>
    g.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    g.course?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Grades Management</h1>
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
            <button onClick={exportPDF} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 whitespace-nowrap">
              📄 Export PDF
            </button>
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap">
              {showForm ? 'Cancel' : '+ Add Grade'}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className={`p-6 rounded-xl shadow mb-6 grid grid-cols-3 gap-4 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <select value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Marks (0-100)" type="number" min="0" max="100" value={form.marks} onChange={e => setForm({...form, marks: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
            <button type="submit" className="col-span-3 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700">Save Grade</button>
          </form>
        )}

        {loading ? <p>Loading...</p> : (
          <div className={`rounded-xl shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
              Showing {filteredGrades.length} of {grades.length} records
            </div>
            <table className="w-full text-sm">
              <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                <tr>
                  <th className="px-6 py-3 text-left">Student</th>
                  <th className="px-6 py-3 text-left">Course</th>
                  <th className="px-6 py-3 text-left">Marks</th>
                  <th className="px-6 py-3 text-left">Grade</th>
                  <th className="px-6 py-3 text-left">GPA</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-500">No grades found</td></tr>
                ) : filteredGrades.map(g => (
                  <tr key={g.id} className={`border-t ${darkMode ? 'hover:bg-gray-700 text-gray-200 border-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">{g.student?.name}</td>
                    <td className="px-6 py-4">{g.course?.name}</td>
                    <td className="px-6 py-4">{g.marks}</td>
                    <td className="px-6 py-4 font-bold">{g.grade}</td>
                    <td className="px-6 py-4">{g.gpa}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${g.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {g.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(g.id)} className="text-red-500 hover:text-red-700">Delete</button>
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