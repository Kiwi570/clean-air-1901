import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { storage } from '@/lib/utils'
import { ROLES } from '@/lib/constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Load user from storage on mount
  useEffect(() => {
    const storedUser = storage.get('user')
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password, role) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      // For V1, create a simple user object
      const newUser = {
        id: Date.now().toString(),
        email,
        role,
        firstName: '',
        lastName: '',
        phone: '',
        avatar: null,
        createdAt: new Date().toISOString(),
      }

      setUser(newUser)
      storage.set('user', newUser)

      // Redirect based on role
      const redirectPath = role === ROLES.HOST ? '/host' : '/cleaner'
      navigate(redirectPath)

      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' }
    }
  }

  // Register function
  const register = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newUser = {
        id: Date.now().toString(),
        email: data.email,
        role: data.role,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        avatar: null,
        createdAt: new Date().toISOString(),
      }

      setUser(newUser)
      storage.set('user', newUser)

      // Redirect based on role
      const redirectPath = data.role === ROLES.HOST ? '/host' : '/cleaner'
      navigate(redirectPath)

      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: "Erreur lors de l'inscription" }
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    storage.remove('user')
    navigate('/')
  }

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      storage.set('user', updatedUser)
      
      return { success: true, user: updatedUser }
    } catch (error) {
      return { success: false, error: 'Erreur lors de la mise à jour' }
    }
  }

  // Switch role (for dev/demo purposes)
  const switchRole = (newRole) => {
    const hostUser = {
      id: 'host-demo',
      email: 'marie@cleanair.fr',
      role: ROLES.HOST,
      firstName: 'Marie',
      lastName: 'Dupont',
      phone: '06 12 34 56 78',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      createdAt: '2024-06-15T00:00:00.000Z',
    }

    const cleanerUser = {
      id: 'cleaner-demo',
      email: 'thomas@cleanair.fr',
      role: ROLES.CLEANER,
      firstName: 'Thomas',
      lastName: 'Laurent',
      phone: '06 98 76 54 32',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      createdAt: '2024-03-20T00:00:00.000Z',
    }

    const newUser = newRole === ROLES.HOST ? hostUser : cleanerUser
    setUser(newUser)
    storage.set('user', newUser)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isHost: user?.role === ROLES.HOST,
    isCleaner: user?.role === ROLES.CLEANER,
    login,
    register,
    logout,
    updateProfile,
    switchRole,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default useAuth
