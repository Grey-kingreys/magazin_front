import { useEffect, useState } from 'react'
import { expenseService } from '../../services/expense.service'
import { CreateExpenseModal } from '../../components/expense/CreateExpenseModal'
import { EditExpenseModal } from '../../components/expense/EditExpenseModal'
import { ExpenseDetailsModal } from '../../components/expense/ExpenseDetailsModal'
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal'
import { theme } from '../../theme/theme'

interface Expense {
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
    category: string
    description: string
    amount: number
    reference: string | null
    paymentMethod: string | null
    date: string
    createdAt: string
}

interface Stats {
    totalExpenses: number
    totalAmount: number
    expensesByCategory: Array<{
        category: string
        _sum: { amount: number }
        _count: number
    }>
    averageExpense: number
}

export function ExpenseManagement() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState<string>('ALL')

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Messages
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [expensesRes, statsRes] = await Promise.all([
                expenseService.getExpenses(1, 100),
                expenseService.getStats()
            ])

            if (expensesRes.success) {
                setExpenses(expensesRes.data.expenses)
            }
            if (statsRes.success) {
                setStats(statsRes.data)
            }
        } catch (error) {
            console.error('Erreur:', error)
            showError('Erreur lors du chargement des données')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteClick = (expense: Expense) => {
        setSelectedExpense(expense)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedExpense) return

        setDeleteLoading(true)
        try {
            const response = await expenseService.deleteExpense(selectedExpense.id)
            if (response.success) {
                showSuccess(`Dépense supprimée avec succès`)
                setShowDeleteModal(false)
                fetchData()
            } else {
                showError(response.message)
            }
        } catch (error) {
            console.error('Erreur:', error)
            showError('Erreur lors de la suppression')
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleEdit = (expense: Expense) => {
        setSelectedExpense(expense)
        setShowEditModal(true)
    }

    const handleViewDetails = (expense: Expense) => {
        setSelectedExpense(expense)
        setShowDetailsModal(true)
    }

    const showSuccess = (message: string) => {
        setSuccessMessage(message)
        setTimeout(() => setSuccessMessage(''), 5000)
    }

    const showError = (message: string) => {
        setErrorMessage(message)
        setTimeout(() => setErrorMessage(''), 5000)
    }

    // Filtrage
    const filteredExpenses = expenses.filter(expense => {
        const matchSearch =
            expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.store.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchCategory = filterCategory === 'ALL' || expense.category === filterCategory

        return matchSearch && matchCategory
    })

    const getPaymentMethodBadge = (method: string | null) => {
        const badges: Record<string, { label: string; color: string }> = {
            CASH: { label: '💵 Espèces', color: 'bg-green-100 text-green-700' },
            CARD: { label: '💳 Carte', color: 'bg-blue-100 text-blue-700' },
            MOBILE_MONEY: { label: '📱 Mobile Money', color: 'bg-purple-100 text-purple-700' },
            CHECK: { label: '📝 Chèque', color: 'bg-orange-100 text-orange-700' }
        }
        const badge = method ? badges[method] : { label: '—', color: 'bg-gray-100 text-gray-700' }
        return <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>{badge.label}</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Gestion des Dépenses</h2>
                    <p className="text-slate-600 mt-1">Suivi et contrôle des sorties d'argent</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className={`${theme.button.base} ${theme.button.primary}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle Dépense
                </button>
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
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-600">Total Dépenses</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalExpenses}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                        <p className="text-sm text-red-700">Montant Total</p>
                        <p className="text-2xl font-bold text-red-900">
                            {stats.totalAmount.toLocaleString('fr-FR')} GNF
                        </p>
                    </div>
                    <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
                        <p className="text-sm text-orange-700">Moyenne</p>
                        <p className="text-2xl font-bold text-orange-900">
                            {stats.averageExpense.toLocaleString('fr-FR')} GNF
                        </p>
                    </div>
                    <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
                        <p className="text-sm text-purple-700">Catégories</p>
                        <p className="text-3xl font-bold text-purple-900">
                            {stats.expensesByCategory.length}
                        </p>
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rechercher</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Description, catégorie, magasin..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="ALL">Toutes les catégories</option>
                            {stats?.expensesByCategory.map(cat => (
                                <option key={cat.category} value={cat.category}>
                                    {cat.category} ({cat._count})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Liste des dépenses */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Catégorie</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Description</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Magasin</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Montant</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Paiement</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-500">
                                        Aucune dépense trouvée
                                    </td>
                                </tr>
                            ) : (
                                filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-slate-50 transition">
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-slate-900">
                                                {new Date(expense.date).toLocaleDateString('fr-FR')}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-slate-900 max-w-xs truncate">
                                                {expense.description}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{expense.store.name}</p>
                                                <p className="text-xs text-slate-500">{expense.store.city}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm font-bold text-red-600">
                                                {expense.amount.toLocaleString('fr-FR')} GNF
                                            </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            {getPaymentMethodBadge(expense.paymentMethod)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(expense)}
                                                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                                                    title="Voir détails"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(expense)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(expense)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Supprimer"
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
                <CreateExpenseModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={fetchData}
                />
            )}

            {showEditModal && selectedExpense && (
                <EditExpenseModal
                    expense={selectedExpense}
                    onClose={() => {
                        setShowEditModal(false)
                        setSelectedExpense(null)
                    }}
                    onSuccess={fetchData}
                />
            )}

            {showDetailsModal && selectedExpense && (
                <ExpenseDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false)
                        setSelectedExpense(null)
                    }}
                    expense={selectedExpense}
                />
            )}

            {showDeleteModal && selectedExpense && (
                <DeleteConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Supprimer la dépense"
                    message={`Êtes-vous sûr de vouloir supprimer cette dépense de ${selectedExpense.amount.toLocaleString('fr-FR')} GNF ?`}
                    itemName={selectedExpense.description}
                    loading={deleteLoading}
                />
            )}
        </div>
    )
}