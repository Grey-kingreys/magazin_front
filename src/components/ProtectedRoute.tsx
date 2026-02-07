import { useEffect, useState } from 'react'
import { theme } from '../theme/theme'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const token = localStorage.getItem('access_token')

        if (!token) {
            setIsAuthenticated(false)
            window.location.href = '/login'
            return
        }

        try {
            // Vérifier la validité du token
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (response.ok) {
                setIsAuthenticated(true)
            } else {
                localStorage.removeItem('access_token')
                setIsAuthenticated(false)
                window.location.href = '/login'
            }
        } catch (error) {
            console.error('Erreur de vérification:', error)
            setIsAuthenticated(false)
            window.location.href = '/login'
        }
    }

    if (isAuthenticated === null) {
        return (
            <div className={`min-h-screen ${theme.background.dashboard} flex items-center justify-center`}>
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-600">Vérification...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}