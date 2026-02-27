import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

const LOST_STATUSES = ['Pending', 'Found']
const COMPLAINT_STATUSES = ['Submitted', 'In Progress', 'Resolved']

export default function AdminPanel() {
  const [lostItems, setLostItems] = useState([])
  const [complaints, setComplaints] = useState([])
  const [volunteers, setVolunteers] = useState([])

  useEffect(() => {
    const qLost = query(collection(db, 'lost_found_items'), orderBy('createdAt', 'desc'))
    const unsubLost = onSnapshot(qLost, snapshot => {
      setLostItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    const qComplaints = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'))
    const unsubComplaints = onSnapshot(qComplaints, snapshot => {
      setComplaints(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    const qVolunteers = query(collection(db, 'volunteers'), orderBy('createdAt', 'desc'))
    const unsubVolunteers = onSnapshot(qVolunteers, snapshot => {
      setVolunteers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    return () => {
      unsubLost()
      unsubComplaints()
      unsubVolunteers()
    }
  }, [])

  const changeLostStatus = async (id, status) => {
    await updateDoc(doc(db, 'lost_found_items', id), { status })
  }

  const changeComplaintStatus = async (id, status) => {
    await updateDoc(doc(db, 'complaints', id), { status })
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-2 text-primary">Admin Panel</h5>
          <p className="small text-muted mb-0">
            As admin you can see all campus records and update statuses for lost &amp; found
            and complaints in real time.
          </p>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="text-secondary mb-3">All Lost &amp; Found Items</h6>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lostItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center small text-muted py-3">
                      No lost &amp; found items yet.
                    </td>
                  </tr>
                )}
                {lostItems.map(item => (
                  <tr key={item.id}>
                    <td className="small text-muted">{item.userId}</td>
                    <td className="text-capitalize">{item.type}</td>
                    <td>{item.title}</td>
                    <td className="small">{item.description}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={item.status}
                        onChange={e => changeLostStatus(item.id, e.target.value)}
                      >
                        {LOST_STATUSES.map(s => (
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

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="text-secondary mb-3">All Complaints</h6>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center small text-muted py-3">
                      No complaints yet.
                    </td>
                  </tr>
                )}
                {complaints.map(c => (
                  <tr key={c.id}>
                    <td className="small text-muted">{c.userId}</td>
                    <td>{c.category}</td>
                    <td className="small">{c.description}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={c.status}
                        onChange={e => changeComplaintStatus(c.id, e.target.value)}
                      >
                        {COMPLAINT_STATUSES.map(s => (
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

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <h6 className="text-secondary mb-3">All Volunteers</h6>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Event</th>
                  <th>Availability</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center small text-muted py-3">
                      No volunteers yet.
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
    </div>
  )
}

