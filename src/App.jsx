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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50/30 to-sky-100">
        <div className="w-10 h-10 border-4 border-[#0057a8] border-t-transparent rounded-full animate-spin" role="status" aria-hidden="true" />
        <span className="sr-only">Loading...</span>
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
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link className="flex items-center gap-2" to={user ? '/dashboard' : '/login'}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0057a8] to-[#66b032] flex items-center justify-center text-white font-bold text-sm">
              SMIT
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#0057a8]">Saylani Mass IT Hub</span>
              <small className="text-gray-500 text-xs">Campus Portal</small>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <>
                <span className="text-sm text-gray-600 hidden md:inline">
                  Signed in as <span className="font-semibold text-[#0057a8]">{user.email}</span>
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#ff4b5c] to-[#ff7f50] text-white shadow-md hover:shadow-lg transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 py-6">{children}</main>
      <footer className="py-3 border-t border-gray-200 bg-white/80 text-center text-sm text-gray-500">
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
