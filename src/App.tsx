import { useEffect, useState } from 'react'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { ResetPassword } from './pages/auth/ResetPassword'
import { Dashboard } from './pages/dashboard/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import './App.css'

// NOUVEAUX IMPORTS
import { UsersManagement } from './pages/users/UsersManagement'
import { UserProfile } from './pages/profile/UserProfile'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { EditProfile } from './components/profile/EditProfile'

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handleLocationChange)

    // Redirection automatique
    if (currentPath === '/') {
      const token = localStorage.getItem('access_token')
      if (token) {
        window.location.href = '/dashboard'
      } else {
        window.location.href = '/login'
      }
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [currentPath])

  const renderPage = () => {
    switch (currentPath) {
      // Routes publiques
      case '/login':
        return <Login />

      case '/register':
        return <Register />

      case '/forgot-password':
        return <ForgotPassword />

      case '/reset-password':
        return <ResetPassword />

      // Dashboard (protégé)
      case '/dashboard':
        return (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )

      // NOUVEAU - Page de gestion des utilisateurs (Admin uniquement)
      case '/users':
        return (
          <ProtectedRoute>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <UsersManagement />
            </main>
            <Footer />
          </ProtectedRoute>
        )

      // NOUVEAU - Page de profil utilisateur (Tous les utilisateurs)
      case '/profile':
        return (
          <ProtectedRoute>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <UserProfile />
            </main>
            <Footer />
          </ProtectedRoute>
        )

      // NOUVEAU - Page de modification du profil (Tous les utilisateurs)
      case '/profile/edit':
        return (
          <ProtectedRoute>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <EditProfile />
            </main>
            <Footer />
          </ProtectedRoute>
        )

      // Page par défaut
      default:
        return <Login />
    }
  }

  return renderPage()
}

export default App