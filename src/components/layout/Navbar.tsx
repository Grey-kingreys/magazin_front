import { useState, useEffect } from 'react'
import { theme } from '../../theme/theme'

interface User {
    id: string
    email: string
    name: string
    role: 'ADMIN' | 'MANAGER' | 'STORE_MANAGER' | 'CASHIER' | 'USER'
    store?: {
        id: string
        name: string
    }
}

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
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
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleDropdown = (menu: string) => {
        setActiveDropdown(activeDropdown === menu ? null : menu)
    }

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
    }

    // Vérifier les permissions par rôle
    const hasAccess = (requiredRoles: string[]) => {
        return user ? requiredRoles.includes(user.role) : false
    }

    // Badge de rôle avec couleur
    const getRoleBadge = () => {
        const badges = {
            ADMIN: { label: 'Admin', color: 'bg-red-100 text-red-700' },
            MANAGER: { label: 'Manager', color: 'bg-purple-100 text-purple-700' },
            STORE_MANAGER: { label: 'Gérant', color: 'bg-blue-100 text-blue-700' },
            CASHIER: { label: 'Caissier', color: 'bg-green-100 text-green-700' },
            USER: { label: 'Utilisateur', color: 'bg-gray-100 text-gray-700' }
        }
        const badge = user ? badges[user.role] : badges.USER
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
                {badge.label}
            </span>
        )
    }

    if (loading) {
        return (
            <nav className={`${theme.navbar.container} sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
            </nav>
        )
    }

    return (
        <nav className={`${theme.navbar.container} sticky top-0 z-50`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <a href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition">
                            <div className="bg-white/10 p-2 rounded-lg">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white hidden md:block">
                                StockPro
                            </span>
                        </a>
                    </div>

                    {/* Navigation principale - Desktop */}
                    <div className="hidden lg:flex items-center gap-1">
                        {/* Dashboard - Tous les rôles */}
                        <a href="/dashboard" className={`${theme.navbar.item} px-4 py-2 rounded-lg`}>
                            <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Tableau de bord
                        </a>

                        {/* Ventes - CASHIER, STORE_MANAGER, MANAGER, ADMIN */}
                        {hasAccess(['ADMIN', 'MANAGER', 'STORE_MANAGER', 'CASHIER']) && (
                            <a href="/ventes" className={`${theme.navbar.item} px-4 py-2 rounded-lg`}>
                                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Ventes
                            </a>
                        )}

                        {/* Stock - Pas pour CASHIER */}
                        {hasAccess(['ADMIN', 'MANAGER', 'STORE_MANAGER']) && (
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('stock')}
                                    className={`${theme.navbar.item} px-4 py-2 rounded-lg flex items-center gap-1`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    Stock
                                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'stock' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {activeDropdown === 'stock' && (
                                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <a href="/products" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            📦 Produits
                                        </a>
                                        <a href="/categories" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            🏷️ Catégories
                                        </a>
                                        <a href="/stock-movements" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            🔄 Mouvements
                                        </a>
                                        <a href="/suppliers" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            🚚 Fournisseurs
                                        </a>
                                        <a href="/stocks" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            📊 Stocks
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Comptabilité - MANAGER et ADMIN uniquement */}
                        {hasAccess(['ADMIN', 'MANAGER']) && (
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('comptabilite')}
                                    className={`${theme.navbar.item} px-4 py-2 rounded-lg flex items-center gap-1`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Comptabilité
                                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'comptabilite' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {activeDropdown === 'comptabilite' && (
                                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <a href="/expenses" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            💸 Dépenses
                                        </a>
                                        <a href="#revenues" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            💰 Recettes
                                        </a>
                                        <a href="/reports" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            📊 Rapports
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {hasAccess(['ADMIN', 'MANAGER', 'STORE_MANAGER', 'CASHIER']) && (
                            <a href="/cash-registers" className={`${theme.navbar.item} px-4 py-2 rounded-lg`}>
                                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Caisses
                            </a>
                        )}

                        {/* Administration - ADMIN uniquement */}
                        {hasAccess(['ADMIN']) && (
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('admin')}
                                    className={`${theme.navbar.item} px-4 py-2 rounded-lg flex items-center gap-1`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Admin
                                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'admin' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {activeDropdown === 'admin' && (
                                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <a href="/users" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            👥 Utilisateurs
                                        </a>
                                        <a href="/stores" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            🏪 Magasins
                                        </a>
                                        <a href="/reports" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                            📊 Rapports
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions utilisateur - Desktop */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Menu Profil */}
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('profile')}
                                className="flex items-center gap-3 px-3 py-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition"
                            >
                                <div className="text-right hidden xl:block">
                                    <div className="text-sm font-medium">{user?.name}</div>
                                    <div className="text-xs opacity-80">{user?.store?.name || 'Tous les magasins'}</div>
                                </div>
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {user?.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {activeDropdown === 'profile' && (
                                <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                                    <div className="px-4 py-3 border-b border-slate-200">
                                        <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                                        <p className="text-xs text-slate-500">{user?.email}</p>
                                        <div className="mt-2">{getRoleBadge()}</div>
                                    </div>
                                    <a href="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                        👤 Mon Profil
                                    </a>
                                    <a href="#parametres" className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                                        ⚙️ Paramètres
                                    </a>
                                    <div className="border-t border-slate-200 mt-2 pt-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                        >
                                            🚪 Déconnexion
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Menu mobile */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white hover:bg-white/10 p-2 rounded-lg transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Menu mobile déplié */}
                {mobileMenuOpen && (
                    <div className="lg:hidden pb-4 border-t border-white/10 mt-4">
                        <div className="space-y-1 pt-4">
                            <div className="px-4 py-2 mb-2">
                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                <p className="text-xs text-blue-200">{user?.email}</p>
                                <div className="mt-2">{getRoleBadge()}</div>
                            </div>

                            <a href="/dashboard" className="block px-4 py-2 text-blue-100 hover:bg-white/10 rounded-lg transition">
                                📊 Dashboard
                            </a>

                            {hasAccess(['ADMIN', 'MANAGER', 'STORE_MANAGER', 'CASHIER']) && (
                                <a href="/ventes" className="block px-4 py-2 text-blue-100 hover:bg-white/10 rounded-lg transition">
                                    🛒 Ventes
                                </a>
                            )}

                            {hasAccess(['ADMIN', 'MANAGER', 'STORE_MANAGER']) && (
                                <>
                                    <div className="px-4 py-2 text-xs text-blue-200 font-semibold uppercase">Stock</div>
                                    <a href="/products" className="block px-4 py-2 text-sm text-blue-100 hover:bg-white/10 rounded-lg transition pl-8">
                                        📦 Produits
                                    </a>
                                    <a href="/categories" className="block px-4 py-2 text-sm text-blue-100 hover:bg-white/10 rounded-lg transition pl-8">
                                        🏷️ Catégories
                                    </a>
                                    <a href="/stock-movements" className="block px-4 py-2 text-sm text-blue-100 hover:bg-white/10 rounded-lg transition pl-8">
                                        🔄 Mouvements
                                    </a>
                                    <a href="/suppliers" className="block px-4 py-2 text-sm text-blue-100 hover:bg-white/10 rounded-lg transition pl-8">
                                        🚚 Fournisseurs
                                    </a>
                                </>
                            )}

                            {hasAccess(['ADMIN']) && (
                                <>
                                    <div className="px-4 py-2 text-xs text-blue-200 font-semibold uppercase">Admin</div>
                                    <a href="/users" className="block px-4 py-2 text-sm text-blue-100 hover:bg-white/10 rounded-lg transition pl-8">
                                        👥 Utilisateurs
                                    </a>
                                    <a href="/stores" className="block px-4 py-2 text-sm text-blue-100 hover:bg-white/10 rounded-lg transition pl-8">
                                        🏪 Magasins
                                    </a>
                                    <a href="/reports" className="block px-4 py-2 text-sm text-blue-100 hover:bg-white/10 rounded-lg transition pl-8">
                                        📊 Rapports
                                    </a>
                                </>
                            )}

                            {hasAccess(['ADMIN', 'MANAGER']) && (
                                <a href="#comptabilite" className="block px-4 py-2 text-blue-100 hover:bg-white/10 rounded-lg transition">
                                    💰 Comptabilité
                                </a>
                            )}

                            <div className="border-t border-white/10 my-2"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-red-300 hover:bg-white/10 rounded-lg transition"
                            >
                                🚪 Déconnexion
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}