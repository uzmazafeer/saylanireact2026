import { Route, Routes, Navigate, Link, useLocation } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Login from './auth/Login'
import Signup from './auth/Signup'
import Dashboard from './dashboard/Dashboard'
import NotFound from './NotFound'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function Layout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="app-root bg-light min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to={user ? '/dashboard' : '/login'}>
            <div className="brand-logo rounded-circle d-flex align-items-center justify-content-center">
              <span className="fw-bold text-white">SMIT</span>
            </div>
            <div className="d-flex flex-column">
              <span className="fw-bold text-primary">Saylani Mass IT Hub</span>
              <small className="text-muted">Campus Portal</small>
            </div>
          </Link>
          <div className="ms-auto d-flex align-items-center gap-3">
            {user && (
              <>
                <span className="small text-muted d-none d-md-inline">
                  Signed in as <span className="fw-semibold text-primary">{user.email}</span>
                </span>
                <button className="btn btn-logout btn-sm" onClick={logout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="py-4">{children}</main>
      <footer className="py-3 border-top text-center small text-muted bg-white">
        © {new Date().getFullYear()} Saylani Mass IT Hub
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* catch-all: show 404 instead of redirecting */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
