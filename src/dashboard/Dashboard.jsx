import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import LostFound from './LostFound'
import Complaints from './Complaints'
import Volunteers from './Volunteers'
import Overview from './Overview'
import AdminPanel from './AdminPanel'
import { useAuth } from '../auth/AuthContext'

export default function Dashboard() {
  const { isAdmin } = useAuth()

  const navClass = ({ isActive }) =>
    `block w-full text-left px-4 py-3 rounded-xl font-medium transition ${isActive ? 'bg-[#0057a8] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-56 shrink-0">
          <div className="rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-gray-200/60 p-2 mb-4">
            <h4 className="px-3 py-2 text-sm font-bold text-[#0057a8]">Campus Dashboard</h4>
            <p className="px-3 pb-3 text-xs text-gray-600">
              Lost &amp; found, complaints, volunteers.
            </p>
          </div>
          <nav className="rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-gray-200/60 p-2 space-y-1">
            <NavLink to="" end className={navClass}>Overview</NavLink>
            <NavLink to="lost-found" className={navClass}>Lost &amp; Found</NavLink>
            <NavLink to="complaints" className={navClass}>Complaints</NavLink>
            <NavLink to="volunteers" className={navClass}>Volunteers</NavLink>
            {isAdmin && <NavLink to="admin" className={navClass}>Admin Panel</NavLink>}
          </nav>
        </div>
        <div className="flex-1 min-w-0">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="lost-found" element={<LostFound />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="volunteers" element={<Volunteers />} />
            {isAdmin && <Route path="admin" element={<AdminPanel />} />}
            {/* any unknown sub-path inside dashboard will go back to Overview */}
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

