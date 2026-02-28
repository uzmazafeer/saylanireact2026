import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../auth/AuthContext'

export default function Overview() {
  const { user } = useAuth()
  const [lostCount, setLostCount] = useState(0)
  const [complaintsCount, setComplaintsCount] = useState(0)
  const [volunteersCount, setVolunteersCount] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.uid) return
    let unsubLost, unsubComplaints, unsubVolunteers
    try {
      unsubLost = onSnapshot(
        collection(db, 'lost_found_items'),
        snapshot => {
          setLostCount(snapshot.docs.filter(d => d.data().userId === user?.uid).length)
          setError(null)
        },
        err => setError(err?.message || 'Firestore error')
      )
      unsubComplaints = onSnapshot(
        collection(db, 'complaints'),
        snapshot => {
          setComplaintsCount(snapshot.docs.filter(d => d.data().userId === user?.uid).length)
          setError(null)
        },
        err => setError(err?.message || 'Firestore error')
      )
      unsubVolunteers = onSnapshot(
        collection(db, 'volunteers'),
        snapshot => {
          setVolunteersCount(snapshot.docs.filter(d => d.data().userId === user?.uid).length)
          setError(null)
        },
        err => setError(err?.message || 'Firestore error')
      )
    } catch (err) {
      setError(err?.message || 'Could not load counts')
    }
    return () => {
      if (typeof unsubLost === 'function') unsubLost()
      if (typeof unsubComplaints === 'function') unsubComplaints()
      if (typeof unsubVolunteers === 'function') unsubVolunteers()
    }
  }, [user?.uid])

  return (
    <div className="w-full min-h-[400px]">
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#0057a8] to-[#4bb543] p-5 text-white shadow-lg">
          <h6 className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-1">
            Lost &amp; Found
          </h6>
          <p className="text-3xl font-bold">{lostCount}</p>
          <p className="text-sm text-white/80 mt-0.5">Items you posted</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#ff7f50] to-[#ffb347] p-5 text-white shadow-lg">
          <h6 className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-1">
            Complaints
          </h6>
          <p className="text-3xl font-bold">{complaintsCount}</p>
          <p className="text-sm text-white/80 mt-0.5">Submitted by you</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#66b032] to-[#2e8b57] p-5 text-white shadow-lg">
          <h6 className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-1">
            Volunteer
          </h6>
          <p className="text-3xl font-bold">{volunteersCount}</p>
          <p className="text-sm text-white/80 mt-0.5">Events you joined</p>
        </div>
      </div>
      <div className="mt-6 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-sm">
        Use the left sidebar to post lost &amp; found items, submit complaints, or register as a
        volunteer. All records are linked to your account and update in real time from Firestore.
      </div>
    </div>
  )
}
