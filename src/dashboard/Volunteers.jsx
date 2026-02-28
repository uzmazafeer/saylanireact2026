import { useEffect, useState, useRef } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
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
      className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-saylani-blue/20"
      style={{ width: '340px' }}
    >
      {/* Header - Saylani colors */}
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
      {/* Body */}
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
  const [selectedForCard, setSelectedForCard] = useState(null)
  const cardRef = useRef(null)

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
    if (!name?.trim() || !event?.trim() || !availability?.trim()) return
    setLoading(true)
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
      console.error(err)
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

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-gray-200/60 overflow-hidden">
      <div className="p-6">
        <div className="mb-6">
          <h5 className="text-xl font-bold text-[#0057a8]">Volunteer Registration</h5>
          <p className="text-sm text-gray-600 mt-0.5">
            Sign up for campus events. Download your volunteer ID card after registering.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0057a8]/30 focus:border-[#0057a8] outline-none"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0057a8]/30 focus:border-[#0057a8] outline-none"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-[#0057a8]/30 focus:border-[#0057a8] outline-none"
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
              className="px-6 py-2.5 rounded-xl font-medium bg-gradient-to-r from-[#66b032] to-[#4bb543] text-white shadow-md hover:shadow-lg transition disabled:opacity-70"
            >
              {loading ? 'Submitting...' : 'Register as Volunteer'}
            </button>
          </div>
        </form>

        <h6 className="text-gray-700 font-semibold mb-3">Volunteer List</h6>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-xl">Name</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3 rounded-tr-xl text-right">ID Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {volunteers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No volunteers registered yet.
                  </td>
                </tr>
              )}
              {volunteers.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/50">
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

      {/* Modal: preview & download ID card */}
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
                className="px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-[#0057a8] to-[#66b032] text-white"
              >
                Download as Image
              </button>
              <button
                type="button"
                onClick={() => setSelectedForCard(null)}
                className="px-5 py-2.5 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
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
