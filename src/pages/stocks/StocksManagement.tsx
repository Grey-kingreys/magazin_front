import { useEffect, useState } from 'react'
import { stockService } from '../../services/stock.service'
import { storeService } from '../../services/store.service'
import { CreateStockModal } from '../../components/stocks/CreateStockModal'
import { AdjustStockModal } from '../../components/stocks/AdjustStockModal'
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal'
import { theme } from '../../theme/theme'

interface Stock {
    id: string
    quantity: number
    isLowStock: boolean
    product: {
        id: string
        name: string
        sku: string
        barcode?: string
        sellingPrice: number
        minStock: number
        unit: string
        isActive: boolean
        category: { id: string; name: string }
    }
    store: {
        id: string
        name: string
        city: string
        isActive: boolean
    }
}

export function StocksManagement() {
    const [stocks, setStocks] = useState<Stock[]>([])
    const [stats, setStats] = useState<any>(null)
    const [stores, setStores] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Filtres
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStore, setFilterStore] = useState('')
    const [filterLowStock, setFilterLowStock] = useState(false)

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showAdjustModal, setShowAdjustModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Messages
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        fetchData()
    }, [searchTerm, filterStore, filterLowStock])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [stocksRes, statsRes, storesRes] = await Promise.all([
                stockService.getStocks(1, 100, searchTerm, filterStore, undefined, filterLowStock),
                stockService.getStats(),
                storeService.getStores(1, 100)
            ])

            if (stocksRes.success) setStocks(stocksRes.data.stocks)
            if (statsRes.success) setStats(statsRes.data)
            if (storesRes.success) setStores(storesRes.data.stores)
        } catch (error) {
            console.error('Erreur:', error)
            showError('Erreur lors du chargement des données')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteClick = (stock: Stock) => {
        if (stock.quantity > 0) {
            showError('Impossible de supprimer un stock avec une quantité > 0. Videz d\'abord le stock.')
            return
        }
        setSelectedStock(stock)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedStock) return

        setDeleteLoading(true)
        try {
            const response = await stockService.deleteStock(selectedStock.id)
            if (response.success) {
                showSuccess(response.message)
                setShowDeleteModal(false)
                fetchData()
            } else {
                showError(response.message)
            }
        } catch (error) {
            showError('Erreur lors de la suppression')
        } finally {
            setDeleteLoading(false)
        }
    }

    const showSuccess = (message: string) => {
        setSuccessMessage(message)
        setTimeout(() => setSuccessMessage(''), 5000)
    }

    const showError = (message: string) => {
        setErrorMessage(message)
        setTimeout(() => setErrorMessage(''), 5000)
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
                    <h2 className="text-2xl font-bold text-slate-800">Gestion des Stocks</h2>
                    <p className="text-slate-600 mt-1">Suivi des stocks par magasin</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className={`${theme.button.base} ${theme.button.primary}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Initialiser un Stock
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
                        <p className="text-sm text-slate-600">Total Stocks</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalStocks}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                        <p className="text-sm text-red-700">Stock Faible</p>
                        <p className="text-3xl font-bold text-red-900">{stats.lowStockCount}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                        <p className="text-sm text-blue-700">Valeur Stock</p>
                        <p className="text-2xl font-bold text-blue-900">
                            {(stats.totalStockValue / 1000000).toFixed(1)}M GNF
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                        <p className="text-sm text-green-700">Valeur Vente Potentielle</p>
                        <p className="text-2xl font-bold text-green-900">
                            {(stats.potentialSaleValue / 1000000).toFixed(1)}M GNF
                        </p>
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rechercher</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nom du produit, SKU, code-barres..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Magasin</label>
                        <select
                            value={filterStore}
                            onChange={(e) => setFilterStore(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Tous les magasins</option>
                            {stores.map(store => (
                                <option key={store.id} value={store.id}>
                                    {store.name} - {store.city}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-3 flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filterLowStock}
                            onChange={(e) => setFilterLowStock(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Afficher uniquement les stocks faibles</span>
                    </label>
                </div>
            </div>

            {/* Liste des stocks */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Produit</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Magasin</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Quantité</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Seuil Min</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Valeur Stock</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Statut</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stocks.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-500">
                                        Aucun stock trouvé
                                    </td>
                                </tr>
                            ) : (
                                stocks.map((stock) => (
                                    <tr key={stock.id} className="hover:bg-slate-50 transition">
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-slate-900">{stock.product.name}</p>
                                                <p className="text-xs text-slate-500">SKU: {stock.product.sku}</p>
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                    {stock.product.category.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{stock.store.name}</p>
                                                <p className="text-xs text-slate-500">{stock.store.city}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div>
                                                <p className="text-lg font-bold text-slate-900">{stock.quantity}</p>
                                                <p className="text-xs text-slate-500">{stock.product.unit}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center text-sm text-slate-600">
                                            {stock.product.minStock} {stock.product.unit}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <p className="text-sm font-medium text-slate-900">
                                                {(stock.quantity * stock.product.sellingPrice).toLocaleString('fr-FR')} GNF
                                            </p>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {stock.isLowStock ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Stock faible
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                    Normal
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedStock(stock)
                                                        setShowAdjustModal(true)
                                                    }}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                                    title="Ajuster le stock"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(stock)}
                                                    disabled={stock.quantity > 0}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={stock.quantity > 0 ? "Impossible de supprimer (quantité > 0)" : "Supprimer"}
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
                <CreateStockModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={fetchData}
                />
            )}

            {showAdjustModal && selectedStock && (
                <AdjustStockModal
                    stock={selectedStock}
                    onClose={() => {
                        setShowAdjustModal(false)
                        setSelectedStock(null)
                    }}
                    onSuccess={fetchData}
                />
            )}

            {showDeleteModal && selectedStock && (
                <DeleteConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Supprimer le stock"
                    message={`Voulez-vous supprimer le stock de "${selectedStock.product.name}" au magasin "${selectedStock.store.name}" ?`}
                    itemName={`${selectedStock.product.name} - ${selectedStock.store.name}`}
                    loading={deleteLoading}
                />
            )}
        </div>
    )
}