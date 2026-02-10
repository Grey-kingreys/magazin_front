import { useEffect, useState } from 'react'
import { cashRegisterService } from '../../services/cash-register.service'
import { OpenCashRegisterModal } from '../../components/cash-register/OpenCashRegisterModal'
import { CloseCashRegisterModal } from '../../components/cash-register/CloseCashRegisterModal'
import { theme } from '../../theme/theme'

interface CashRegister {
    id: string
    store: {
        id: string
        name: string
        city: string
    }
    user: {
        id: string
        name: string
        email: string
    }
    openingAmount: number
    availableAmount: number
    closingAmount: number | null
    expectedAmount: number | null
    difference: number | null
    status: 'OPEN' | 'CLOSED'
    openedAt: string
    closedAt: string | null
    _count?: {
        sales: number
    }
    stats?: {
        expectedAmount?: number
        cashSalesTotal?: number
        totalRevenue?: number
        salesCount?: number
    }
}

interface Stats {
    totalCashRegisters: number
    openCashRegisters: number
    closedCashRegisters: number
    totalRevenue: number
    totalDifference: number
    positiveDiscrepancies: number
    negativeDiscrepancies: number
    perfectMatches: number
    totalOpeningAmount?: number
    totalClosingAmount?: number
    totalCashSales?: number
    totalNonCashSales?: number
    totalSales?: number
}

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

export function CashRegisterManagement() {
    const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState<string>('ALL')
    const [user, setUser] = useState<User | null>(null)

    // Modals
    const [showOpenModal, setShowOpenModal] = useState(false)
    const [showCloseModal, setShowCloseModal] = useState(false)
    const [selectedCashRegister, setSelectedCashRegister] = useState<CashRegister | null>(null)

    // Messages
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        fetchUserData()
        fetchData()
    }, [filterStatus])

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
            console.error('Erreur lors du chargement des données utilisateur:', error)
        }
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const status = filterStatus === 'ALL' ? undefined : filterStatus as 'OPEN' | 'CLOSED'

            const [registersRes, statsRes] = await Promise.all([
                cashRegisterService.getCashRegisters(1, 100, undefined, status),
                cashRegisterService.getStats()
            ])

            if (registersRes.success && registersRes.data) {
                setCashRegisters(registersRes.data.cashRegisters)
            } else if (registersRes.success && !registersRes.data) {
                setCashRegisters([])
            }

            if (statsRes.success && statsRes.data) {
                setStats(statsRes.data)
            } else if (statsRes.success && !statsRes.data) {
                setStats({
                    totalCashRegisters: 0,
                    openCashRegisters: 0,
                    closedCashRegisters: 0,
                    totalRevenue: 0,
                    totalDifference: 0,
                    positiveDiscrepancies: 0,
                    negativeDiscrepancies: 0,
                    perfectMatches: 0,
                    totalOpeningAmount: 0,
                    totalClosingAmount: 0,
                    totalCashSales: 0,
                    totalNonCashSales: 0,
                    totalSales: 0
                })
            }
        } catch (error) {
            console.error('Erreur:', error)
            showError('Erreur lors du chargement des données')
            setStats({
                totalCashRegisters: 0,
                openCashRegisters: 0,
                closedCashRegisters: 0,
                totalRevenue: 0,
                totalDifference: 0,
                positiveDiscrepancies: 0,
                negativeDiscrepancies: 0,
                perfectMatches: 0,
                totalOpeningAmount: 0,
                totalClosingAmount: 0,
                totalCashSales: 0,
                totalNonCashSales: 0,
                totalSales: 0
            })
        } finally {
            setLoading(false)
        }
    }

    // Fonction pour vérifier si l'utilisateur peut fermer la caisse
    const canCloseCashRegister = (cashRegister: CashRegister): boolean => {
        if (!user) return false

        // Les administrateurs et managers peuvent fermer toutes les caisses
        if (user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'STORE_MANAGER') {
            return true
        }

        // Les caissiers et utilisateurs normaux ne peuvent fermer que les caisses qu'ils ont ouvertes
        return cashRegister.user.id === user.id
    }

    // Fonction pour vérifier si l'utilisateur peut ouvrir une caisse
    const canOpenCashRegister = (): boolean => {
        if (!user) return false

        // Tous les utilisateurs sauf USER peuvent ouvrir une caisse
        return user.role !== 'USER'
    }

    const handleCloseClick = (cashRegister: CashRegister) => {
        if (!canCloseCashRegister(cashRegister)) {
            showError('Vous ne pouvez fermer que les caisses que vous avez ouvertes')
            return
        }
        setSelectedCashRegister(cashRegister)
        setShowCloseModal(true)
    }

    const showSuccess = (message: string) => {
        setSuccessMessage(message)
        setTimeout(() => setSuccessMessage(''), 5000)
    }

    const showError = (message: string) => {
        setErrorMessage(message)
        setTimeout(() => setErrorMessage(''), 5000)
    }

    // Fonction helper pour formatter les nombres en toute sécurité
    const formatNumber = (value: number | undefined | null): string => {
        if (value === undefined || value === null) return '0'
        return value.toLocaleString('fr-FR')
    }

    // Fonction pour obtenir la couleur du badge selon le rôle
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-100 text-red-700 border border-red-200'
            case 'MANAGER':
                return 'bg-purple-100 text-purple-700 border border-purple-200'
            case 'STORE_MANAGER':
                return 'bg-indigo-100 text-indigo-700 border border-indigo-200'
            case 'CASHIER':
                return 'bg-blue-100 text-blue-700 border border-blue-200'
            default:
                return 'bg-slate-100 text-slate-700 border border-slate-200'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-600">Chargement des caisses...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* En-tête avec info utilisateur */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Gestion des Caisses</h2>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-slate-600">Ouverture, fermeture et suivi des sessions de caisse</p>
                        {user && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                {user.role === 'ADMIN' && 'Administrateur'}
                                {user.role === 'MANAGER' && 'Manager'}
                                {user.role === 'STORE_MANAGER' && 'Gérant Magasin'}
                                {user.role === 'CASHIER' && 'Caissier'}
                                {user.role === 'USER' && 'Utilisateur'}
                            </span>
                        )}
                    </div>
                </div>
                {canOpenCashRegister() && (
                    <button
                        onClick={() => setShowOpenModal(true)}
                        className={`${theme.button.base} ${theme.button.success}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Ouvrir une Caisse
                    </button>
                )}
            </div>

            {/* Messages */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errorMessage}
                </div>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-600">Total Caisses</p>
                    <p className="text-3xl font-bold text-slate-900">
                        {formatNumber(stats?.totalCashRegisters)}
                    </p>
                </div>
                <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                    <p className="text-sm text-green-700">Ouvertes</p>
                    <p className="text-3xl font-bold text-green-900">
                        {formatNumber(stats?.openCashRegisters)}
                    </p>
                </div>
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                    <p className="text-sm text-blue-700">Fermées</p>
                    <p className="text-3xl font-bold text-blue-900">
                        {formatNumber(stats?.closedCashRegisters)}
                    </p>
                </div>
                <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
                    <p className="text-sm text-purple-700">Chiffre d'affaires</p>
                    <p className="text-2xl font-bold text-purple-900">
                        {formatNumber(stats?.totalRevenue)} GNF
                    </p>
                </div>
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                    <p className="text-sm text-amber-700">Ventes Espèces</p>
                    <p className="text-2xl font-bold text-amber-900">
                        {formatNumber(stats?.totalCashSales)} GNF
                    </p>
                </div>
            </div>

            {/* Filtre */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="ALL">Toutes les caisses</option>
                    <option value="OPEN">Ouvertes</option>
                    <option value="CLOSED">Fermées</option>
                </select>
            </div>

            {/* Liste des caisses */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Magasin</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Utilisateur</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Ouverture</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Disponible</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Fermeture</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Différence</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Statut</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {cashRegisters.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-slate-500">
                                        Aucune caisse trouvée
                                    </td>
                                </tr>
                            ) : (
                                cashRegisters.map((register) => {
                                    const canClose = register.status === 'OPEN' && canCloseCashRegister(register)
                                    const isCurrentUserOpener = user && register.user.id === user.id

                                    return (
                                        <tr key={register.id} className="hover:bg-slate-50 transition">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-slate-900">{register.store.name}</p>
                                                    <p className="text-xs text-slate-500">{register.store.city}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-slate-900">{register.user.name}</p>
                                                    {isCurrentUserOpener && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            Vous
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500">{register.user.email}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">
                                                        {register.openingAmount.toLocaleString('fr-FR')} GNF
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(register.openedAt).toLocaleString('fr-FR')}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {register.status === 'OPEN' ? (
                                                    <div>
                                                        <p className="text-sm font-bold text-blue-900">
                                                            {register.availableAmount.toLocaleString('fr-FR')} GNF
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Montant disponible
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-slate-400">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                {register.closingAmount !== null ? (
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">
                                                            {register.closingAmount.toLocaleString('fr-FR')} GNF
                                                        </p>
                                                        {register.closedAt && (
                                                            <p className="text-xs text-slate-500">
                                                                {new Date(register.closedAt).toLocaleString('fr-FR')}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-slate-400">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                {register.difference !== null ? (
                                                    <span className={`text-sm font-bold ${register.difference > 0 ? 'text-green-600' :
                                                        register.difference < 0 ? 'text-red-600' :
                                                            'text-slate-600'
                                                        }`}>
                                                        {register.difference > 0 ? '+' : ''}{register.difference.toLocaleString('fr-FR')} GNF
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-slate-400">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                {register.status === 'OPEN' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                        Ouverte
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                                                        Fermée
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {register.status === 'OPEN' && (user?.role === 'ADMIN' || user?.id === register.user?.id) && (
                                                        <button
                                                            onClick={() => handleCloseClick(register)}
                                                            disabled={!canClose}
                                                            className={`p-2 rounded-lg transition flex items-center gap-1 ${canClose
                                                                ? 'text-orange-600 hover:bg-orange-50 hover:text-orange-700 cursor-pointer'
                                                                : 'text-slate-400 cursor-not-allowed bg-slate-50'
                                                                }`}
                                                            title={canClose
                                                                ? "Fermer la caisse"
                                                                : isCurrentUserOpener
                                                                    ? "Fermeture impossible"
                                                                    : "Vous ne pouvez fermer que les caisses que vous avez ouvertes"
                                                            }
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                            </svg>
                                                            {!canClose && (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    )}
                                                    <button
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                                        title="Voir détails"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {showOpenModal && (
                <OpenCashRegisterModal
                    onClose={() => setShowOpenModal(false)}
                    onSuccess={fetchData}
                />
            )}

            {showCloseModal && selectedCashRegister && (
                <CloseCashRegisterModal
                    cashRegister={selectedCashRegister}
                    onClose={() => {
                        setShowCloseModal(false)
                        setSelectedCashRegister(null)
                    }}
                    onSuccess={fetchData}
                />
            )}
        </div>
    )
}