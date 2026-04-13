import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', description: '', credits: '', department: '' })
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { darkMode } = useTheme()

  useEffect(() => { fetchCourses() }, [])

  useEffect(() => {
    setFiltered(courses.filter(c =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.department?.toLowerCase().includes(search.toLowerCase())
    ))
  }, [search, courses])

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses')
      setCourses(res.data)
      setFiltered(res.data)
    } catch (err) {
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, form)
      } else {
        await api.post('/courses', form)
      }
      setShowForm(false)
      setEditingId(null)
      setForm({ name: '', code: '', description: '', credits: '', department: '' })
      fetchCourses()
    } catch (err) {
      setError('Failed to save course')
    }
  }

  const handleEdit = (course) => {
    setForm({
      name: course.name,
      code: course.code,
      description: course.description || '',
      credits: course.credits || '',
      department: course.department || ''
    })
    setEditingId(course.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`)
        fetchCourses()
      } catch (err) {
        setError('Failed to delete course')
      }
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Course Management</h1>
        <button onClick={() => navigate('/admin')} className="bg-white text-blue-700 px-4 py-1 rounded-lg font-medium">Back</button>
      </nav>
      <div className="p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-between items-center mb-4 gap-4">
          <input
            placeholder="Search by name, code, department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full max-w-md"
          />
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', code: '', description: '', credits: '', department: '' }) }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap">
            {showForm ? 'Cancel' : '+ Add Course'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className={`p-6 rounded-xl shadow mb-6 grid grid-cols-2 gap-4 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <h3 className={`col-span-2 font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>{editingId ? 'Edit Course' : 'Add New Course'}</h3>
            <input placeholder="Course Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
            <input placeholder="Course Code" value={form.code} onChange={e => setForm({...form, code: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
            <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
            <input placeholder="Credits" type="number" value={form.credits} onChange={e => setForm({...form, credits: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
            <input placeholder="Department" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
            <button type="submit" className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700">{editingId ? 'Update Course' : 'Save Course'}</button>
          </form>
        )}

        {loading ? <p>Loading...</p> : (
          <div className={`rounded-xl shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
              Showing {filtered.length} of {courses.length} courses
            </div>
            <table className="w-full text-sm">
              <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Code</th>
                  <th className="px-6 py-3 text-left">Department</th>
                  <th className="px-6 py-3 text-left">Credits</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No courses found</td></tr>
                ) : filtered.map(c => (
                  <tr key={c.id} className={`border-t ${darkMode ? 'hover:bg-gray-700 text-gray-200 border-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">{c.name}</td>
                    <td className="px-6 py-4">{c.code}</td>
                    <td className="px-6 py-4">{c.department}</td>
                    <td className="px-6 py-4">{c.credits}</td>
                    <td className="px-6 py-4 flex gap-3">
                      <button onClick={() => handleEdit(c)} className="text-blue-500 hover:text-blue-700">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700">Delete</button>
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