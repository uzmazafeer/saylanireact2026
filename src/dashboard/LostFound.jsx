import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../auth/AuthContext'

const STATUSES = ['Pending', 'Found']

export default function LostFound() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('lost')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = query(
      collection(db, 'lost_found_items'),
      orderBy('createdAt', 'desc'),
    )
    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(i => i.userId === user?.uid)
      setItems(data)
    })
    return () => unsub()
  }, [user?.uid])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!title || !description) return
    setLoading(true)
    try {
      await addDoc(collection(db, 'lost_found_items'), {
        title,
        description,
        type,
        imageUrl: imageUrl || null,
        status: 'Pending',
        userId: user.uid,
        createdAt: serverTimestamp(),
      })
      setTitle('')
      setDescription('')
      setImageUrl('')
      setType('lost')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    await updateDoc(doc(db, 'lost_found_items', id), { status })
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="card-title mb-1 text-primary">Lost &amp; Found</h5>
            <p className="text-muted small mb-0">
              Post lost or found items. Track status in real-time.
            </p>
          </div>
        </div>
        <form className="row g-3 mb-4" onSubmit={handleSubmit}>
          <div className="col-md-3">
            <label className="form-label small">Type</label>
            <select
              className="form-select"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small">Title</label>
            <input
              className="form-control"
              placeholder="e.g. Black Wallet"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="col-md-5">
            <label className="form-label small">Description</label>
            <input
              className="form-control"
              placeholder="Short description, where you lost/found it..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small">Image URL (optional)</label>
            <input
              className="form-control"
              placeholder="Paste image link (Drive, Imgur, etc.)"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
          </div>
          <div className="col-md-6 d-flex align-items-end justify-content-end">
            <button className="btn btn-success px-4" disabled={loading}>
              {loading ? 'Posting...' : 'Post Item'}
            </button>
          </div>
        </form>
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead className="table-light">
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Description</th>
                <th>Image</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted small py-3">
                    No items yet. Create your first lost or found post.
                  </td>
                </tr>
              )}
              {items.map(item => (
                <tr key={item.id}>
                  <td className="text-capitalize">
                    <span
                      className={`badge ${
                        item.type === 'lost' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td>{item.title}</td>
                  <td className="small">{item.description}</td>
                  <td>
                    {item.imageUrl ? (
                      <a
                        href={item.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-muted small">No image</span>
                    )}
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={item.status}
                      onChange={e => handleStatusChange(item.id, e.target.value)}
                    >
                      {STATUSES.map(s => (
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

