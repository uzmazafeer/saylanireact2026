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

  useEffect(() => {
    const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(c => c.userId === user?.uid)
      setComplaints(data)
    })
    return () => unsub()
  }, [user?.uid])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!description) return
    setLoading(true)
    try {
      await addDoc(collection(db, 'complaints'), {
        category,
        description,
        status: 'Submitted',
        userId: user.uid,
        createdAt: serverTimestamp(),
      })
      setDescription('')
      setCategory(CATEGORIES[0])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    await updateDoc(doc(db, 'complaints', id), { status })
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="card-title mb-1 text-primary">Complaints</h5>
            <p className="text-muted small mb-0">
              Submit campus complaints and track resolution status.
            </p>
          </div>
        </div>
        <form className="row g-3 mb-4" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label small">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-8">
            <label className="form-label small">Description</label>
            <input
              className="form-control"
              placeholder="Describe the issue clearly..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary px-4" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead className="table-light">
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted small py-3">
                    No complaints yet.
                  </td>
                </tr>
              )}
              {complaints.map(c => (
                <tr key={c.id}>
                  <td>{c.category}</td>
                  <td className="small">{c.description}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={c.status}
                      onChange={e => handleStatusChange(c.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
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
