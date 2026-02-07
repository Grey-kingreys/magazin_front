// src/pages/UserProfile.tsx (version simplifiée)
import { useEffect, useState } from 'react'
import { authService } from '../../services/api.service'
import { ChangePasswordModal } from '../../components/users/ChangePasswordModal'

interface User {
    id: string
    name: string
    email: string
    role: string
    isActive: boolean
    createdAt: string
    store?: {
        id: string
        name: string
        city: string
    }
}

export function UserProfile() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const response = await authService.getProfile()
            if (response.success) {
                setUser(response.data)
            }
        } catch (error) {
            console.error('Erreur:', error)
        } finally {
            setLoading(false)
        }
    }

    const getRoleBadge = (role: string) => {
        const badges = {
            ADMIN: { label: 'Admin', color: 'bg-red-100 text-red-700 border-red-200' },
            MANAGER: { label: 'Manager', color: 'bg-purple-100 text-purple-700 border-purple-200' },
            STORE_MANAGER: { label: 'Gérant', color: 'bg-blue-100 text-blue-700 border-blue-200' },
            CASHIER: { label: 'Caissier', color: 'bg-green-100 text-green-700 border-green-200' },
            USER: { label: 'Utilisateur', color: 'bg-gray-100 text-gray-700 border-gray-200' }
        }
        const badge = badges[role as keyof typeof badges] || badges.USER
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${badge.color}`}>
                {badge.label}
            </span>
        )
    }

    const handleEditProfile = () => {
        window.location.href = '/profile/edit'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-600">Chargement...</p>
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* En-tête */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Mon Profil</h2>
                    <p className="text-slate-600 mt-1">Gérer mes informations personnelles</p>
                </div>
                <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier le profil
                </button>
            </div>

            {/* Card principale */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {/* Header avec avatar */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border-4 border-white/30">
                            <span className="text-4xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-1">{user.name}</h3>
                            <p className="text-indigo-100 mb-3">{user.email}</p>
                            <div className="flex items-center gap-3">
                                {getRoleBadge(user.role)}
                                {user.isActive ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-400/50 text-white rounded-full text-sm font-medium">
                                        <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                                        Actif
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-400/50 text-white rounded-full text-sm font-medium">
                                        <span className="w-2 h-2 bg-red-300 rounded-full"></span>
                                        Inactif
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informations */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Nom complet</p>
                            <p className="text-lg font-medium text-slate-900">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Email</p>
                            <p className="text-lg font-medium text-slate-900">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Rôle</p>
                            <p className="text-lg font-medium text-slate-900">{user.role}</p>
                        </div>
                        {user.store && (
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Magasin assigné</p>
                                <p className="text-lg font-medium text-slate-900">{user.store.name}</p>
                                <p className="text-sm text-slate-500">{user.store.city}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Membre depuis</p>
                            <p className="text-lg font-medium text-slate-900">
                                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sécurité */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Sécurité
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <p className="font-medium text-slate-900">Mot de passe</p>
                            <p className="text-sm text-slate-600">Dernière modification il y a longtemps</p>
                        </div>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Modifier
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showPasswordModal && (
                <ChangePasswordModal
                    user={user}
                    isAdmin={false}
                    onClose={() => setShowPasswordModal(false)}
                />
            )}
        </div>
    )
}