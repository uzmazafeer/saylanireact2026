import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
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
    const q = query(
      collection(db, 'complaints'),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(
      q,
      snapshot => {
        const data = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(c => c.userId === user.uid)
        setComplaints(data)
        setError(null)
      },
      err => {
        console.error('Complaints listener error:', err)
        setError(err.message)
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
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateDoc(doc(db, 'complaints', id), { status })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-gray-200/60 overflow-hidden">
      <div className="p-6">
        <div className="mb-6">
          <h5 className="text-xl font-bold text-[#0057a8]">Complaints</h5>
          <p className="text-sm text-gray-600 mt-0.5">
            Submit campus complaints and track resolution status.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0057a8]/30 focus:border-[#0057a8] outline-none bg-white"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0057a8]/30 focus:border-[#0057a8] outline-none"
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
              className="w-full px-4 py-2.5 rounded-xl font-medium bg-gradient-to-r from-[#0057a8] to-[#0076e0] text-white shadow-md hover:shadow-lg transition disabled:opacity-70"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>

        <h6 className="text-gray-700 font-semibold mb-3">My Complaints</h6>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-xl">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    No complaints yet.
                  </td>
                </tr>
              )}
              {complaints.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.category}</td>
                  <td className="px-4 py-3 text-gray-600">{c.description}</td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#0057a8]/30 focus:border-[#0057a8] outline-none"
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
