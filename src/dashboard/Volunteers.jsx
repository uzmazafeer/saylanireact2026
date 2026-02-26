import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../auth/AuthContext'

export default function Volunteers() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [event, setEvent] = useState('')
  const [availability, setAvailability] = useState('')
  const [loading, setLoading] = useState(false)
  const [volunteers, setVolunteers] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'volunteers'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setVolunteers(data)
    })
    return () => unsub()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!name || !event || !availability) return
    setLoading(true)
    try {
      await addDoc(collection(db, 'volunteers'), {
        name,
        event,
        availability,
        userId: user.uid,
        createdAt: serverTimestamp(),
      })
      setName('')
      setEvent('')
      setAvailability('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="card-title mb-1 text-primary">Volunteer Registration</h5>
            <p className="text-muted small mb-0">
              Sign up to help at campus events. Admins can view all volunteers.
            </p>
          </div>
        </div>
        <form className="row g-3 mb-4" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label small">Name</label>
            <input
              className="form-control"
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small">Event</label>
            <input
              className="form-control"
              placeholder="Event name"
              value={event}
              onChange={e => setEvent(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small">Availability</label>
            <input
              className="form-control"
              placeholder="e.g. Weekends, evenings"
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              required
            />
          </div>
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-success px-4" disabled={loading}>
              {loading ? 'Submitting...' : 'Register as Volunteer'}
            </button>
          </div>
        </form>
        <h6 className="mb-2 text-secondary">Volunteer List (Admin View)</h6>
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Event</th>
                <th>Availability</th>
                <th>Registered By</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted small py-3">
                    No volunteers registered yet.
                  </td>
                </tr>
              )}
              {volunteers.map(v => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.event}</td>
                  <td className="small">{v.availability}</td>
                  <td className="small text-muted">{v.userId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

