import { useEffect, useState } from 'react'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { ResetPassword } from './pages/auth/ResetPassword'
import { Dashboard } from './pages/dashboard/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import './App.css'

// Gestion des utilisateurs
import { UsersManagement } from './pages/users/UsersManagement'
import { UserProfile } from './pages/profile/UserProfile'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { EditProfile } from './components/profile/EditProfile'
import { StoresManagement } from './pages/stores/StoresManagement'

// Catégories et Fournisseurs
import { CategoriesManagement } from './pages/categories/CategoriesManagement'
import { SuppliersManagement } from './pages/suppliers/SuppliersManagement'

// Produits et Stocks
import { ProductsManagement } from './pages/products/ProductsManagement'
import { StocksManagement } from './pages/stocks/StocksManagement'

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

      // Gestion des utilisateurs (Admin uniquement)
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

      // Page de profil utilisateur (Tous les utilisateurs)
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

      // Page de modification du profil (Tous les utilisateurs)
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

      // Gestion des magasins
      case '/stores':
        return (
          <ProtectedRoute>
            <Navbar />
            <main>
              <StoresManagement />
            </main>
            <Footer />
          </ProtectedRoute>
        )

      // Gestion des catégories
      case '/categories':
        return (
          <ProtectedRoute>
            <Navbar />
            <main>
              <CategoriesManagement />
            </main>
            <Footer />
          </ProtectedRoute>
        )

      // Gestion des fournisseurs
      case '/suppliers':
        return (
          <ProtectedRoute>
            <Navbar />
            <main>
              <SuppliersManagement />
            </main>
            <Footer />
          </ProtectedRoute>
        )

      // 🆕 Gestion des produits
      case '/products':
        return (
          <ProtectedRoute>
            <Navbar />
            <main>
              <ProductsManagement />
            </main>
            <Footer />
          </ProtectedRoute>
        )

      // 🆕 Gestion des stocks
      case '/stocks':
        return (
          <ProtectedRoute>
            <Navbar />
            <main>
              <StocksManagement />
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