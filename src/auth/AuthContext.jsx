import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'

const ADMIN_EMAILS = ['admin@smit.com']

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, current => {
      setUser(current)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const logout = async () => {
    await signOut(auth)
  }

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email || '')

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}


