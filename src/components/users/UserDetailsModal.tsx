import { theme } from '../../theme/theme'

interface UserDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    user: {
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
}

export function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
    if (!isOpen) return null

    const getRoleLabel = (role: string) => {
        const roles: Record<string, string> = {
            'ADMIN': 'Administrateur',
            'MANAGER': 'Manager',
            'STORE_MANAGER': 'Gérant de magasin',
            'CASHIER': 'Caissier',
            'USER': 'Utilisateur'
        }
        return roles[role] || role
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`${theme.card.base} w-full max-w-2xl mx-4 shadow-2xl`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800">Détails de l'utilisateur</h3>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-6">
                    {/* Photo et nom */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-slate-800">{user.name}</h4>
                            <p className="text-sm text-slate-600">{user.email}</p>
                        </div>
                    </div>

                    {/* Informations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Rôle</h5>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                    user.role === 'MANAGER' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'STORE_MANAGER' ? 'bg-blue-100 text-blue-800' :
                                            user.role === 'CASHIER' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                }`}>
                                {getRoleLabel(user.role)}
                            </span>
                        </div>

                        <div>
                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Statut</h5>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {user.isActive ? 'Actif' : 'Inactif'}
                            </span>
                        </div>

                        {user.store && (
                            <>
                                <div>
                                    <h5 className="text-sm font-semibold text-slate-700 mb-2">Magasin assigné</h5>
                                    <p className="text-sm text-slate-800">{user.store.name}</p>
                                    <p className="text-xs text-slate-500">{user.store.city}</p>
                                </div>
                            </>
                        )}

                        <div>
                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Date de création</h5>
                            <p className="text-sm text-slate-800">
                                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end rounded-b-xl">
                    <button
                        onClick={onClose}
                        className={`${theme.button.base} ${theme.button.secondary}`}
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    )
}