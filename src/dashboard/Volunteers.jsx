import { useEffect, useState, useRef } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import html2canvas from 'html2canvas'
import { db } from '../firebase'
import { useAuth } from '../auth/AuthContext'

function VolunteerIdCard({ volunteer, cardRef }) {
  if (!volunteer) return null
  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#0057a8]/30"
      style={{ width: '340px' }}
    >
      <div className="bg-gradient-to-r from-[#0057a8] to-[#66b032] px-6 py-4 text-white">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
            SMIT
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Saylani Mass IT Hub</h2>
            <p className="text-xs text-white/90">Volunteer ID Card</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0057a8] to-[#66b032] flex items-center justify-center text-2xl font-bold text-white">
            {volunteer.name?.charAt(0)?.toUpperCase() || 'V'}
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-gray-800">{volunteer.name}</h3>
          <p className="text-sm text-gray-600">Event: {volunteer.event}</p>
          <p className="text-xs text-gray-500">Availability: {volunteer.availability}</p>
        </div>
        <div className="pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-500">
          <span>ID: {volunteer.id?.slice(-8)?.toUpperCase() || 'N/A'}</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  )
}

export default function Volunteers() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [event, setEvent] = useState('')
  const [availability, setAvailability] = useState('')
  const [loading, setLoading] = useState(false)
  const [volunteers, setVolunteers] = useState([])
  const [loadingVolunteers, setLoadingVolunteers] = useState(true)
  const [selectedForCard, setSelectedForCard] = useState(null)
  const [error, setError] = useState(null)
  const cardRef = useRef(null)

  // subscribe for volunteers after auth is available
  useEffect(() => {
    // reset state if user signs out
    if (!user) {
      setVolunteers([])
      setError(null)
      setLoadingVolunteers(false)
      return
    }

    setLoadingVolunteers(true)
    const unsub = onSnapshot(
      collection(db, 'volunteers'),
      snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        data.sort((a, b) =>
          (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
        )
        console.debug('volunteers snapshot', data)
        setVolunteers(data)
        setError(null)
        setLoadingVolunteers(false)
      },
      err => {
        console.error('volunteers listener error', err)
        setError(err?.message || 'Could not load volunteers')
        setLoadingVolunteers(false)
      }
    )
    return () => unsub()
  }, [user])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!user) {
      setError('You must be signed in to register a volunteer.')
      return
    }
    if (!name?.trim() || !event?.trim() || !availability?.trim()) return
    setLoading(true)
    setError(null)
    try {
      await addDoc(collection(db, 'volunteers'), {
        name: name.trim(),
        event: event.trim(),
        availability: availability.trim(),
        userId: user?.uid,
        createdAt: serverTimestamp(),
      })
      setName('')
      setEvent('')
      setAvailability('')
    } catch (err) {
      setError(err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadIdCard = async () => {
    if (!cardRef.current || !selectedForCard) return
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `smit-volunteer-${selectedForCard.name?.replace(/\s+/g, '-')}-${selectedForCard.id?.slice(-6)}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  if (!user) {
    return (
      <div className="w-full min-h-[400px] rounded-2xl bg-white shadow-lg border border-gray-200 overflow-hidden flex items-center justify-center">
        <p className="text-gray-600">Please sign in to view volunteers.</p>
      </div>
    )
  }

  return (
    <div className="w-full min-h-[400px] rounded-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#0057a8] mb-1">Volunteer Registration</h2>
        <p className="text-gray-600 text-sm mb-6">
          Sign up for campus events. Download your volunteer ID card after registering.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0057a8]/30 focus:border-[#0057a8] outline-none"
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
            <input
              type="text"
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0057a8]/30 focus:border-[#0057a8] outline-none"
              placeholder="Event name"
              value={event}
              onChange={e => setEvent(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <input
              type="text"
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0057a8]/30 focus:border-[#0057a8] outline-none"
              placeholder="e.g. Weekends, evenings"
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-medium bg-[#66b032] text-white border-2 border-[#66b032] hover:bg-[#55942a] transition disabled:opacity-70"
            >
              {loading ? 'Submitting...' : 'Register as Volunteer'}
            </button>
          </div>
        </form>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Volunteer List</h3>
        <div className="overflow-x-auto rounded-xl border-2 border-gray-200 bg-gray-50/50">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#66b032] text-white">
              <tr>
                <th className="px-4 py-3 rounded-tl-xl">Name</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3 rounded-tr-xl text-right">ID Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loadingVolunteers ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading volunteers...
                  </td>
                </tr>
              ) : volunteers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No volunteers registered yet. Register using the form above.
                  </td>
                </tr>
              ) : null}
              {volunteers.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{v.name}</td>
                  <td className="px-4 py-3 text-gray-600">{v.event}</td>
                  <td className="px-4 py-3 text-gray-600">{v.availability}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedForCard(v)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0057a8] text-white hover:bg-[#00467f] transition"
                    >
                      Download ID Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedForCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedForCard(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <VolunteerIdCard volunteer={selectedForCard} cardRef={cardRef} />
            </div>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={handleDownloadIdCard}
                className="px-5 py-2.5 rounded-xl font-medium bg-[#0057a8] text-white hover:bg-[#00467f]"
              >
                Download as Image
              </button>
              <button
                type="button"
                onClick={() => setSelectedForCard(null)}
                className="px-5 py-2.5 rounded-xl font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
