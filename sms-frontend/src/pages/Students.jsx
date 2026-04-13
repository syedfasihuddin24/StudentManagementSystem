import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Students() {
  const [students, setStudents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', rollNumber: '', department: '', year: '' })
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { darkMode } = useTheme()

  useEffect(() => { fetchStudents() }, [])

  useEffect(() => {
    setFiltered(students.filter(s =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase())
    ))
  }, [search, students])

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students')
      setStudents(res.data)
      setFiltered(res.data)
    } catch (err) {
      setError('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, form)
      } else {
        await api.post('/students', form)
      }
      setShowForm(false)
      setEditingId(null)
      setForm({ name: '', email: '', rollNumber: '', department: '', year: '' })
      fetchStudents()
    } catch (err) {
      setError('Failed to save student')
    }
  }

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      department: student.department || '',
      year: student.year || ''
    })
    setEditingId(student.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`)
        fetchStudents()
      } catch (err) {
        setError('Failed to delete student')
      }
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Student Management</h1>
        <button onClick={() => navigate('/admin')} className="bg-white text-blue-700 px-4 py-1 rounded-lg font-medium">Back</button>
      </nav>
      <div className="p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-between items-center mb-4 gap-4">
          <input
            placeholder="Search by name, email, roll no, department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full max-w-md"
          />
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', email: '', rollNumber: '', department: '', year: '' }) }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap">
            {showForm ? 'Cancel' : '+ Add Student'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className={`p-6 rounded-xl shadow mb-6 grid grid-cols-2 gap-4 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <h3 className={`col-span-2 font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>{editingId ? 'Edit Student' : 'Add New Student'}</h3>
            <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
            <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
            <input placeholder="Roll Number" value={form.rollNumber} onChange={e => setForm({...form, rollNumber: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
            <input placeholder="Department" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
            <input placeholder="Year" type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} className={`border rounded-lg px-4 py-2 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
            <button type="submit" className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700">{editingId ? 'Update Student' : 'Save Student'}</button>
          </form>
        )}

        {loading ? <p>Loading...</p> : (
          <div className={`rounded-xl shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
              Showing {filtered.length} of {students.length} students
            </div>
            <table className="w-full text-sm">
              <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Roll No</th>
                  <th className="px-6 py-3 text-left">Department</th>
                  <th className="px-6 py-3 text-left">Year</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No students found</td></tr>
                ) : filtered.map(s => (
                  <tr key={s.id} className={`border-t ${darkMode ? 'hover:bg-gray-700 text-gray-200 border-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">{s.name}</td>
                    <td className="px-6 py-4">{s.email}</td>
                    <td className="px-6 py-4">{s.rollNumber}</td>
                    <td className="px-6 py-4">{s.department}</td>
                    <td className="px-6 py-4">{s.year}</td>
                    <td className="px-6 py-4 flex gap-3">
                      <button onClick={() => handleEdit(s)} className="text-blue-500 hover:text-blue-700">Edit</button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700">Delete</button>
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