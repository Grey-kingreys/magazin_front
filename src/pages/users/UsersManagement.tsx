import { useEffect, useState } from 'react'
import { userService, authService } from '../../services/api.service'
import { CreateUserModal } from '../../components/users/CreateUserModal'
import { EditUserModal } from '../../components/users/EditUserModal'
import { ChangePasswordModal } from '../../components/users/ChangePasswordModal'

interface User {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'MANAGER' | 'STORE_MANAGER' | 'CASHIER' | 'USER'
    isActive: boolean
    createdAt: string
    store?: {
        id: string
        name: string
        city: string
    }
}

interface Stats {
    totalUsers: number
    activeUsers: number
    inactiveUsers: number
    usersWithStore: number
    usersWithoutStore: number
    usersByRole: Array<{
        role: string
        _count: number
    }>
}

interface CurrentUser {
    id: string
    email: string
    name: string
    role: string
}

export function UsersManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState<string>('ALL')
    const [filterStatus, setFilterStatus] = useState<string>('ALL')

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    useEffect(() => {
        fetchCurrentUser()
        fetchData()
    }, [])

    const fetchCurrentUser = async () => {
        try {
            const response = await authService.getProfile()
            if (response.success) {
                setCurrentUser(response.data)
            }
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const [usersRes, statsRes] = await Promise.all([
                userService.getUsers(),
                userService.getStats()
            ])

            if (usersRes.success) setUsers(usersRes.data)
            if (statsRes.success) setStats(statsRes.data)
        } catch (error) {
            console.error('Erreur:', error)
        } finally {
            setLoading(false)
        }
    }

    const isCurrentUser = (userId: string) => {
        return currentUser?.id === userId
    }

    const handleToggleActive = async (userId: string, userName: string) => {
        // Empêcher l'admin de se désactiver lui-même
        if (isCurrentUser(userId)) {
            alert('❌ Vous ne pouvez pas désactiver votre propre compte !')
            return
        }

        if (!confirm(`Êtes-vous sûr de vouloir changer le statut de "${userName}" ?`)) return

        const response = await userService.toggleActive(userId)
        if (response.success) {
            fetchData()
        } else {
            alert(response.message)
        }
    }

    const handleDelete = async (userId: string, userName: string) => {
        // Empêcher l'admin de se supprimer lui-même
        if (isCurrentUser(userId)) {
            alert('❌ Vous ne pouvez pas supprimer votre propre compte !')
            return
        }

        const confirmed = confirm(
            `⚠️ ATTENTION : Suppression définitive\n\n` +
            `Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?\n\n` +
            `Cette action est IRRÉVERSIBLE et ne fonctionnera que si l'utilisateur n'a aucune activité enregistrée.\n\n` +
            `Tapez "SUPPRIMER" pour confirmer.`
        )

        if (!confirmed) return

        // Double confirmation
        const confirmationText = prompt('Tapez "SUPPRIMER" en majuscules pour confirmer :')
        if (confirmationText !== 'SUPPRIMER') {
            alert('Suppression annulée')
            return
        }

        const response = await userService.deleteUser(userId)
        if (response.success) {
            alert('✅ ' + response.message)
            fetchData()
        } else {
            alert('❌ ' + response.message)
        }
    }

    const handleChangePassword = (user: User) => {
        // Permettre de changer n'importe quel mot de passe, y compris le sien
        setSelectedUser(user)
        setShowPasswordModal(true)
    }

    const handleEdit = (user: User) => {
        // Empêcher l'admin de modifier son propre rôle
        if (isCurrentUser(user.id)) {
            alert('ℹ️ Pour modifier votre profil, utilisez la page "Mon Profil"')
            return
        }

        setSelectedUser(user)
        setShowEditModal(true)
    }

    // Filtrage des utilisateurs
    const filteredUsers = users.filter(user => {
        const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchRole = filterRole === 'ALL' || user.role === filterRole
        const matchStatus = filterStatus === 'ALL' ||
            (filterStatus === 'ACTIVE' && user.isActive) ||
            (filterStatus === 'INACTIVE' && !user.isActive)

        return matchSearch && matchRole && matchStatus
    })

    const getRoleBadge = (role: string) => {
        const badges = {
            ADMIN: { label: 'Admin', color: 'bg-red-100 text-red-700' },
            MANAGER: { label: 'Manager', color: 'bg-purple-100 text-purple-700' },
            STORE_MANAGER: { label: 'Gérant', color: 'bg-blue-100 text-blue-700' },
            CASHIER: { label: 'Caissier', color: 'bg-green-100 text-green-700' },
            USER: { label: 'Utilisateur', color: 'bg-gray-100 text-gray-700' }
        }
        const badge = badges[role as keyof typeof badges] || badges.USER
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
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

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Gestion des Utilisateurs</h2>
                    <p className="text-slate-600 mt-1">Gérer les comptes, rôles et permissions</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvel Utilisateur
                </button>
            </div>

            {/* Statistiques */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-600">Total</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                        <p className="text-sm text-green-700">Actifs</p>
                        <p className="text-3xl font-bold text-green-900">{stats.activeUsers}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                        <p className="text-sm text-red-700">Inactifs</p>
                        <p className="text-3xl font-bold text-red-900">{stats.inactiveUsers}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                        <p className="text-sm text-blue-700">Avec magasin</p>
                        <p className="text-3xl font-bold text-blue-900">{stats.usersWithStore}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-600">Sans magasin</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.usersWithoutStore}</p>
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rechercher</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nom ou email..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rôle</label>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="ALL">Tous les rôles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MANAGER">Manager</option>
                            <option value="STORE_MANAGER">Gérant</option>
                            <option value="CASHIER">Caissier</option>
                            <option value="USER">Utilisateur</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="ALL">Tous</option>
                            <option value="ACTIVE">Actifs</option>
                            <option value="INACTIVE">Inactifs</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Liste des utilisateurs */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Utilisateur</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Rôle</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Magasin</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Statut</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Créé le</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
                                        Aucun utilisateur trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className={`hover:bg-slate-50 transition ${isCurrentUser(user.id) ? 'bg-indigo-50/30' : ''}`}>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 flex items-center gap-2">
                                                        {user.name}
                                                        {isCurrentUser(user.id) && (
                                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">VOUS</span>
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {user.store ? (
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{user.store.name}</p>
                                                    <p className="text-xs text-slate-500">{user.store.city}</p>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {user.isActive ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                    Actif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                                    Inactif
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600">
                                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    disabled={isCurrentUser(user.id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={isCurrentUser(user.id) ? "Utilisez 'Mon Profil' pour vous modifier" : "Modifier"}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleChangePassword(user)}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                                    title="Changer le mot de passe"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(user.id, user.name)}
                                                    disabled={isCurrentUser(user.id)}
                                                    className={`p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${user.isActive
                                                        ? 'text-orange-600 hover:bg-orange-50'
                                                        : 'text-green-600 hover:bg-green-50'
                                                        }`}
                                                    title={isCurrentUser(user.id) ? "Vous ne pouvez pas vous désactiver" : (user.isActive ? 'Désactiver' : 'Activer')}
                                                >
                                                    {user.isActive ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                    disabled={isCurrentUser(user.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={isCurrentUser(user.id) ? "Vous ne pouvez pas vous supprimer" : "Supprimer"}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={fetchData}
                />
            )}

            {showEditModal && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => {
                        setShowEditModal(false)
                        setSelectedUser(null)
                    }}
                    onSuccess={fetchData}
                />
            )}

            {showPasswordModal && selectedUser && (
                <ChangePasswordModal
                    user={selectedUser}
                    isAdmin={!isCurrentUser(selectedUser.id)}
                    onClose={() => {
                        setShowPasswordModal(false)
                        setSelectedUser(null)
                    }}
                />
            )}
        </div>
    )
}