import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import LostFound from './LostFound'
import Complaints from './Complaints'
import Volunteers from './Volunteers'
import Overview from './Overview'
import AdminPanel from './AdminPanel'
import { useAuth } from '../auth/AuthContext'
import NotFound from '../NotFound'

export default function Dashboard() {
  const { isAdmin } = useAuth()

  return (
    <div className="container">
      <div className="row g-3">
        <div className="col-12">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body d-flex flex-wrap gap-2 justify-content-between align-items-center">
              <div>
                <h4 className="mb-1 text-primary">Campus Dashboard</h4>
                <p className="mb-0 small text-muted">
                  Manage lost &amp; found, complaints, volunteers and real-time updates.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-lg-2">
          <div className="list-group shadow-sm rounded-3 mb-3">
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `list-group-item list-group-item-action ${isActive ? 'active' : ''}`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="lost-found"
              className={({ isActive }) =>
                `list-group-item list-group-item-action ${isActive ? 'active' : ''}`
              }
            >
              Lost &amp; Found
            </NavLink>
            <NavLink
              to="complaints"
              className={({ isActive }) =>
                `list-group-item list-group-item-action ${isActive ? 'active' : ''}`
              }
            >
              Complaints
            </NavLink>
            <NavLink
              to="volunteers"
              className={({ isActive }) =>
                `list-group-item list-group-item-action ${isActive ? 'active' : ''}`
              }
            >
              Volunteers
            </NavLink>
            {isAdmin && (
              <NavLink
                to="admin"
                className={({ isActive }) =>
                  `list-group-item list-group-item-action ${isActive ? 'active' : ''}`
                }
              >
                Admin Panel
              </NavLink>
            )}
          </div>
        </div>
        <div className="col-md-9 col-lg-10">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="lost-found" element={<LostFound />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="volunteers" element={<Volunteers />} />
            {isAdmin && <Route path="admin" element={<AdminPanel />} />}
            {/* show 404 inside dashboard when sub-path unrecognized */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

