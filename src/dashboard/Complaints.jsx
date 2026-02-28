import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../auth/AuthContext'

const CATEGORIES = ['Internet', 'Electricity', 'Water', 'Maintenance', 'Other']
const STATUS_OPTIONS = ['Submitted', 'In Progress', 'Resolved']

export default function Complaints() {
  const { user } = useAuth()
  const [category, setCategory] = useState(CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [complaints, setComplaints] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.uid) return
    const unsub = onSnapshot(
      collection(db, 'complaints'),
      snapshot => {
        const data = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(c => c.userId === user.uid)
        data.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
        setComplaints(data)
        setError(null)
      },
      err => {
        setError(err?.message || 'Could not load complaints')
      }
    )
    return () => unsub()
  }, [user?.uid])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!description?.trim()) return
    setLoading(true)
    setError(null)
    try {
      await addDoc(collection(db, 'complaints'), {
        category,
        description: description.trim(),
        status: 'Submitted',
        userId: user.uid,
        createdAt: serverTimestamp(),
      })
      setDescription('')
      setCategory(CATEGORIES[0])
    } catch (err) {
      setError(err?.message || 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateDoc(doc(db, 'complaints', id), { status })
    } catch (err) {
      setError(err?.message)
    }
  }

  return (
    <div className="w-full min-h-[400px] rounded-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#0057a8] mb-1">Complaints</h2>
        <p className="text-gray-600 text-sm mb-6">
          Submit campus complaints and track resolution status.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0057a8]/30 focus:border-[#0057a8] outline-none bg-white"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0057a8]/30 focus:border-[#0057a8] outline-none"
              placeholder="Describe the issue clearly..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl font-medium bg-[#0057a8] text-white border-2 border-[#0057a8] hover:bg-[#00467f] transition disabled:opacity-70"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">My Complaints</h3>
        <div className="overflow-x-auto rounded-xl border-2 border-gray-200 bg-gray-50/50">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#0057a8] text-white">
              <tr>
                <th className="px-4 py-3 rounded-tl-xl">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {complaints.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    No complaints yet. Submit one using the form above.
                  </td>
                </tr>
              )}
              {complaints.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.category}</td>
                  <td className="px-4 py-3 text-gray-600">{c.description}</td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded-lg border-2 border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#0057a8]/30 focus:border-[#0057a8] outline-none"
                      value={c.status}
                      onChange={e => handleStatusChange(c.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
