import { useEffect, useState } from 'react'
import { saleService } from '../../services/sale.service'
import { storeService } from '../../services/store.service'
import { CreateSaleModal } from '../../components/sales/CreateSaleModal'
import { SaleDetailsModal } from '../../components/sales/SaleDetailsModal'
import { ChangeSaleStatusModal } from '../../components/sales/ChangeSaleStatusModal'
import { theme } from '../../theme/theme'

interface Sale {
    id: string
    saleNumber: string
    storeId: string
    userId: string
    subtotal: number
    discount: number
    tax: number
    total: number
    paymentMethod: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'CHECK'
    amountPaid: number
    change: number
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
    notes?: string
    createdAt: string
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
    items: Array<{
        id: string
        productId: string
        quantity: number
        unitPrice: number
        subtotal: number
        product: {
            id: string
            name: string
            sku: string
            unit: string
        }
    }>
    _count: {
        items: number
    }
}

interface Stats {
    totalSales: number
    totalRevenue: number
    totalProfit: number
    totalItemsSold: number
    averageSaleAmount: number
    salesByStore: Array<{
        id: string
        name: string
        _count: {
            sales: number
        }
    }>
    salesByPaymentMethod: Array<{
        paymentMethod: string
        _count: number
        _sum: {
            total: number
        }
    }>
}

interface Store {
    id: string
    name: string
    city: string
}

export function SalesManagement() {
    const [sales, setSales] = useState<Sale[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [stores, setStores] = useState<Store[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // Filtres
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStore, setFilterStore] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

    // Messages
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        fetchStores()
        fetchData()
    }, [page, filterStore, filterStatus, startDate, endDate])

    const fetchStores = async () => {
        try {
            const response = await storeService.getStores(1, 100)
            if (response.success) {
                setStores(response.data.stores)
            }
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const [salesRes, statsRes] = await Promise.all([
                saleService.getSales(
                    page,
                    50,
                    filterStore || undefined,
                    filterStatus || undefined,
                    startDate || undefined,
                    endDate || undefined,
                    searchTerm || undefined
                ),
                saleService.getStats(
                    filterStore || undefined,
                    startDate || undefined,
                    endDate || undefined
                )
            ])

            if (salesRes.success) {
                setSales(salesRes.data.sales)
                setTotalPages(salesRes.data.pagination.totalPages)
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

    const handleSearch = () => {
        setPage(1)
        fetchData()
    }

    const handleViewDetails = (sale: Sale) => {
        setSelectedSale(sale)
        setShowDetailsModal(true)
    }

    const handleChangeStatus = (sale: Sale) => {
        setSelectedSale(sale)
        setShowStatusModal(true)
    }

    const showSuccess = (message: string) => {
        setSuccessMessage(message)
        setTimeout(() => setSuccessMessage(''), 5000)
    }

    const showError = (message: string) => {
        setErrorMessage(message)
        setTimeout(() => setErrorMessage(''), 5000)
    }

    const getStatusBadge = (status: string) => {
        const badges = {
            PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
            COMPLETED: { label: 'Complétée', color: 'bg-green-100 text-green-700' },
            CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-700' },
            REFUNDED: { label: 'Remboursée', color: 'bg-purple-100 text-purple-700' }
        }
        const badge = badges[status as keyof typeof badges]
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
    }

    const getPaymentBadge = (method: string) => {
        const badges = {
            CASH: { label: '💵 Espèces', color: 'bg-green-100 text-green-700' },
            CARD: { label: '💳 Carte', color: 'bg-blue-100 text-blue-700' },
            MOBILE_MONEY: { label: '📱 Mobile Money', color: 'bg-purple-100 text-purple-700' },
            CHECK: { label: '📄 Chèque', color: 'bg-orange-100 text-orange-700' }
        }
        const badge = badges[method as keyof typeof badges]
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
    }

    if (loading && page === 1) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-600">Chargement des ventes...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">🛒 Gestion des Ventes (POS)</h2>
                    <p className="text-slate-600 mt-1">Point de vente et historique des transactions</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className={`${theme.button.base} ${theme.button.success}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle Vente
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
                        <p className="text-sm text-slate-600">Ventes totales</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalSales}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                        <p className="text-sm text-green-700">Chiffre d'affaires</p>
                        <p className="text-2xl font-bold text-green-900">{(stats.totalRevenue / 1000000).toFixed(1)}M GNF</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                        <p className="text-sm text-blue-700">Profit</p>
                        <p className="text-2xl font-bold text-blue-900">{(stats.totalProfit / 1000000).toFixed(1)}M GNF</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
                        <p className="text-sm text-purple-700">Articles vendus</p>
                        <p className="text-3xl font-bold text-purple-900">{stats.totalItemsSold}</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
                        <p className="text-sm text-orange-700">Panier moyen</p>
                        <p className="text-2xl font-bold text-orange-900">{(stats.averageSaleAmount / 1000).toFixed(0)}K GNF</p>
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rechercher</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="N° de vente..."
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                onClick={handleSearch}
                                className={`${theme.button.base} ${theme.button.primary}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Magasin</label>
                        <select
                            value={filterStore}
                            onChange={(e) => setFilterStore(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Tous</option>
                            {stores.map(store => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Tous</option>
                            <option value="PENDING">En attente</option>
                            <option value="COMPLETED">Complétée</option>
                            <option value="CANCELLED">Annulée</option>
                            <option value="REFUNDED">Remboursée</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date début</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date fin</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>
            </div>

            {/* Liste des ventes */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">N° Vente</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date & Heure</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Magasin</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Articles</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Paiement</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Total</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Statut</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-slate-500">
                                        Aucune vente trouvée
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-50 transition">
                                        <td className="py-3 px-4">
                                            <span className="font-mono text-sm font-semibold text-slate-800">{sale.saleNumber}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm text-slate-800">
                                                {new Date(sale.createdAt).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {new Date(sale.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm font-medium text-slate-800">{sale.store.name}</div>
                                            <div className="text-xs text-slate-500">{sale.store.city}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                {sale._count.items} article{sale._count.items > 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">{getPaymentBadge(sale.paymentMethod)}</td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="text-sm font-bold text-slate-900">{sale.total.toLocaleString()} GNF</span>
                                        </td>
                                        <td className="py-3 px-4">{getStatusBadge(sale.status)}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(sale)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Voir détails"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleChangeStatus(sale)}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                                    title="Changer statut"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                        Page {page} sur {totalPages}
                    </div>
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

            {/* Modals */}
            {showCreateModal && (
                <CreateSaleModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        showSuccess('Vente créée avec succès !')
                        fetchData()
                    }}
                />
            )}

            {showDetailsModal && selectedSale && (
                <SaleDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false)
                        setSelectedSale(null)
                    }}
                    sale={selectedSale}
                />
            )}

            {showStatusModal && selectedSale && (
                <ChangeSaleStatusModal
                    isOpen={showStatusModal}
                    onClose={() => {
                        setShowStatusModal(false)
                        setSelectedSale(null)
                    }}
                    onSuccess={() => {
                        showSuccess('Statut modifié avec succès !')
                        fetchData()
                    }}
                    sale={selectedSale}
                />
            )}
        </div>
    )
}