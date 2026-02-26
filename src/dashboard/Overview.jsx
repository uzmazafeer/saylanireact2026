import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../auth/AuthContext'

export default function Overview() {
  const { user } = useAuth()
  const [lostCount, setLostCount] = useState(0)
  const [complaintsCount, setComplaintsCount] = useState(0)
  const [volunteersCount, setVolunteersCount] = useState(0)

  useEffect(() => {
    const unsubLost = onSnapshot(collection(db, 'lost_found_items'), snapshot => {
      setLostCount(snapshot.docs.filter(d => d.data().userId === user?.uid).length)
    })
    const unsubComplaints = onSnapshot(collection(db, 'complaints'), snapshot => {
      setComplaintsCount(snapshot.docs.filter(d => d.data().userId === user?.uid).length)
    })
    const unsubVolunteers = onSnapshot(collection(db, 'volunteers'), snapshot => {
      setVolunteersCount(snapshot.docs.filter(d => d.data().userId === user?.uid).length)
    })
    return () => {
      unsubLost()
      unsubComplaints()
      unsubVolunteers()
    }
  }, [user?.uid])

  return (
    <div className="row g-3">
      <div className="col-md-4">
        <div className="card shadow-sm border-0 overview-card overview-lost">
          <div className="card-body">
            <h6 className="text-uppercase small text-muted mb-1">Lost &amp; Found</h6>
            <h2 className="mb-0 text-white">{lostCount}</h2>
            <p className="mb-0 small text-white-50">Items you posted</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm border-0 overview-card overview-complaints">
          <div className="card-body">
            <h6 className="text-uppercase small text-muted mb-1">Complaints</h6>
            <h2 className="mb-0 text-white">{complaintsCount}</h2>
            <p className="mb-0 small text-white-50">Submitted by you</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm border-0 overview-card overview-volunteers">
          <div className="card-body">
            <h6 className="text-uppercase small text-muted mb-1">Volunteer</h6>
            <h2 className="mb-0 text-white">{volunteersCount}</h2>
            <p className="mb-0 small text-white-50">Events you joined</p>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="alert alert-info border-0 shadow-sm small mb-0">
          Use the left sidebar to post lost &amp; found items, submit complaints, or
          register as a volunteer. All records are linked to your account and update
          in real time from Firestore.
        </div>
      </div>
    </div>
  )
}

