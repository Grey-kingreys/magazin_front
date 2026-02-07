import { useEffect, useState } from 'react'
import { theme } from '../../theme/theme'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { AdminDashboard } from './roles/AdminDashboard'
import { ManagerDashboard } from './roles/ManagerDashboard'
import { StoreManagerDashboard } from './roles/StoreManagerDashboard'
import { CashierDashboard } from './roles/CashierDashboard'
import { UserDashboard } from './roles/UserDashboard'

interface User {
    id: string
    email: string
    name: string
    role: 'ADMIN' | 'MANAGER' | 'STORE_MANAGER' | 'CASHIER' | 'USER'
    storeId: string
    store: {
        id: string
        name: string
        city: string
    }
}

export function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('access_token')

            const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            const userData = await userResponse.json()

            if (userData.success) {
                setUser(userData.data)
            } else {
                // Token invalide, rediriger vers login
                localStorage.removeItem('access_token')
                window.location.href = '/login'
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error)
            localStorage.removeItem('access_token')
            window.location.href = '/login'
        } finally {
            setLoading(false)
        }
    }

    // Affichage pendant le chargement
    if (loading) {
        return (
            <div className={`min-h-screen ${theme.background.dashboard} flex items-center justify-center`}>
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-600">Chargement du tableau de bord...</p>
                </div>
            </div>
        )
    }

    if (!user) return null

    // Fonction pour rendre le dashboard approprié selon le rôle
    const renderDashboard = () => {
        switch (user.role) {
            case 'ADMIN':
                return <AdminDashboard />

            case 'MANAGER':
                return <ManagerDashboard />

            case 'STORE_MANAGER':
                // Vérifier que l'utilisateur a un store
                if (!user.storeId || !user.store) {
                    return (
                        <div className="text-center py-12">
                            <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-lg mb-4">
                                <p className="font-bold">Configuration requise</p>
                                <p>Votre compte n'est associé à aucun magasin. Contactez l'administrateur.</p>
                            </div>
                        </div>
                    )
                }
                return <StoreManagerDashboard user={user} />

            case 'CASHIER':
                // Vérifier que l'utilisateur a un store
                if (!user.storeId || !user.store) {
                    return (
                        <div className="text-center py-12">
                            <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-lg mb-4">
                                <p className="font-bold">Configuration requise</p>
                                <p>Votre compte n'est associé à aucun magasin. Contactez l'administrateur.</p>
                            </div>
                        </div>
                    )
                }
                return <CashierDashboard user={user} />

            case 'USER':
            default:
                return <UserDashboard user={user} />
        }
    }

    return (
        <div className={`min-h-screen ${theme.background.dashboard}`}>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderDashboard()}
            </main>
            <Footer />
        </div>
    )
}