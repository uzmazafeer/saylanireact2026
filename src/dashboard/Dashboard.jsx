import { Link, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import '../App.css'

import Overview from './Overview'
import LostFound from './LostFound'
import Complaints from './Complaints'
import Volunteers from './Volunteers'
import AdminPanel from './AdminPanel'

export default function Dashboard() {
  const { isAdmin } = useAuth()

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* sidebar */}
       <Link to="overview" className="list-group-item list-group-item-action">
  Overview
</Link>

<Link to="lost-found" className="list-group-item list-group-item-action">
  Lost &amp; Found
</Link>

<Link to="complaints" className="list-group-item list-group-item-action">
  Complaints
</Link>

<Link to="volunteers" className="list-group-item list-group-item-action">
  Volunteers
</Link>


        {/* content area */}
        <section className="flex-1">
          <Routes>
            <Route index element={<Navigate to="/dashboard/overview" replace />} />            <Route path="overview" element={<Overview />} />
            <Route path="lost-found" element={<LostFound />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="volunteers" element={<Volunteers />} />
            {isAdmin && <Route path="admin" element={<AdminPanel />} />}
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </section>
      </div>
    </div>
  )
}
