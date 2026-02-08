import { useEffect, useState } from 'react'
import { stockMovementService } from '../../services/stock-movement.service'
import { storeService } from '../../services/store.service'
import { productService } from '../../services/product.service'
import { CreateStockMovementModal } from '../../components/stock-movements/CreateStockMovementModal'
import { StockMovementDetailsModal } from '../../components/stock-movements/StockMovementDetailsModal'
import { theme } from '../../theme/theme'

interface StockMovement {
    id: string
    type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT'
    quantity: number
    reference?: string
    notes?: string
    createdAt: string
    product: {
        id: string
        name: string
        sku: string
        unit: string
    }
    store: {
        id: string
        name: string
        city: string
    }
    user: {
        id: string
        name: string
    }
    fromStoreId?: string
    toStoreId?: string
}

interface Stats {
    totalMovements: number
    byType: {
        in: number
        out: number
        transfer: number
        adjustment: number
    }
}

export function StockMovementsManagement() {
    const [movements, setMovements] = useState<StockMovement[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [stores, setStores] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Filtres
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<string>('ALL')
    const [filterStore, setFilterStore] = useState<string>('ALL')
    const [filterProduct, setFilterProduct] = useState<string>('ALL')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    // Pagination
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null)

    // Notifications
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        fetchStores()
        fetchProducts()
        fetchData()
    }, [page, filterType, filterStore, filterProduct, startDate, endDate])

    const fetchStores = async () => {
        try {
            const response = await storeService.getStores()
            if (response.success) {
                setStores(response.data.stores)
            }
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await productService.getProducts()
            if (response.success) {
                setProducts(response.data.products)
            }
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const [movementsRes, statsRes] = await Promise.all([
                stockMovementService.getMovements(
                    page,
                    50,
                    filterStore !== 'ALL' ? filterStore : undefined,
                    filterProduct !== 'ALL' ? filterProduct : undefined,
                    undefined,
                    filterType !== 'ALL' ? filterType : undefined,
                    startDate || undefined,
                    endDate || undefined
                ),
                stockMovementService.getStats(
                    startDate || undefined,
                    endDate || undefined
                )
            ])

            if (movementsRes.success) {
                setMovements(movementsRes.data.movements)
                setTotal(movementsRes.data.pagination.total)
                setTotalPages(movementsRes.data.pagination.totalPages)
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

    const handleViewDetails = (movement: StockMovement) => {
        setSelectedMovement(movement)
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

    const handleResetFilters = () => {
        setSearchTerm('')
        setFilterType('ALL')
        setFilterStore('ALL')
        setFilterProduct('ALL')
        setStartDate('')
        setEndDate('')
        setPage(1)
    }

    // Filtrage côté client pour la recherche
    const filteredMovements = movements.filter(movement => {
        if (!searchTerm) return true
        const search = searchTerm.toLowerCase()
        return (
            movement.product.name.toLowerCase().includes(search) ||
            movement.product.sku.toLowerCase().includes(search) ||
            movement.reference?.toLowerCase().includes(search) ||
            movement.notes?.toLowerCase().includes(search)
        )
    })

    const getTypeBadge = (type: string) => {
        const badges = {
            IN: { label: 'Entrée', color: 'bg-green-100 text-green-700', icon: '📥' },
            OUT: { label: 'Sortie', color: 'bg-red-100 text-red-700', icon: '📤' },
            TRANSFER: { label: 'Transfert', color: 'bg-blue-100 text-blue-700', icon: '🔄' },
            ADJUSTMENT: { label: 'Ajustement', color: 'bg-purple-100 text-purple-700', icon: '⚖️' }
        }
        const badge = badges[type as keyof typeof badges]
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                <span>{badge.icon}</span>
                {badge.label}
            </span>
        )
    }

    if (loading && movements.length === 0) {
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
                    <h2 className="text-2xl font-bold text-slate-800">Mouvements de Stock</h2>
                    <p className="text-slate-600 mt-1">Suivi des entrées, sorties et transferts</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className={`${theme.button.base} ${theme.button.primary}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouveau Mouvement
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-600">Total</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalMovements}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                        <p className="text-sm text-green-700">Entrées 📥</p>
                        <p className="text-3xl font-bold text-green-900">{stats.byType.in}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                        <p className="text-sm text-red-700">Sorties 📤</p>
                        <p className="text-3xl font-bold text-red-900">{stats.byType.out}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                        <p className="text-sm text-blue-700">Transferts 🔄</p>
                        <p className="text-3xl font-bold text-blue-900">{stats.byType.transfer}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
                        <p className="text-sm text-purple-700">Ajustements ⚖️</p>
                        <p className="text-3xl font-bold text-purple-900">{stats.byType.adjustment}</p>
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rechercher</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Produit, SKU, référence..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="ALL">Tous les types</option>
                            <option value="IN">Entrée</option>
                            <option value="OUT">Sortie</option>
                            <option value="TRANSFER">Transfert</option>
                            <option value="ADJUSTMENT">Ajustement</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Magasin</label>
                        <select
                            value={filterStore}
                            onChange={(e) => setFilterStore(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="ALL">Tous les magasins</option>
                            {stores.map(store => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Produit</label>
                        <select
                            value={filterProduct}
                            onChange={(e) => setFilterProduct(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="ALL">Tous les produits</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date début</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date fin</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleResetFilters}
                        className={`${theme.button.base} ${theme.button.secondary}`}
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            </div>

            {/* Liste des mouvements */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Produit</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Type</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Quantité</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Magasin</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Utilisateur</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Référence</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredMovements.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-slate-500">
                                        Aucun mouvement trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredMovements.map((movement) => (
                                    <tr key={movement.id} className="hover:bg-slate-50 transition">
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-slate-900">{movement.product.name}</p>
                                                <p className="text-xs text-slate-500">SKU: {movement.product.sku}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {getTypeBadge(movement.type)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-slate-900">
                                                {movement.quantity} {movement.product.unit}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{movement.store.name}</p>
                                                <p className="text-xs text-slate-500">{movement.store.city}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600">
                                            {movement.user.name}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600">
                                            {movement.reference || '—'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600">
                                            {new Date(movement.createdAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(movement)}
                                                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                            Page {page} sur {totalPages} • {total} résultat(s)
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`${theme.button.base} ${theme.button.secondary} disabled:opacity-50`}
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className={`${theme.button.base} ${theme.button.secondary} disabled:opacity-50`}
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateStockMovementModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        fetchData()
                        showSuccess('Mouvement créé avec succès')
                    }}
                />
            )}

            {showDetailsModal && selectedMovement && (
                <StockMovementDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false)
                        setSelectedMovement(null)
                    }}
                    movement={selectedMovement}
                />
            )}
        </div>
    )
}