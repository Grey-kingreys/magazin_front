import { useEffect, useState } from 'react'
import { storeService } from '../../services/store.service'
import { theme } from '../../theme/theme'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { CreateStoreModal } from '../../components/stores/CreateStoreModal'
import { EditStoreModal } from '../../components/stores/EditStoreModal'
import { StoreDetailsModal } from '../../components/stores/StoreDetailsModal'
import { DeleteStoreModal } from '../../components/stores/DeleteStoreModal'

interface Store {
    id: string
    name: string
    email?: string
    phone?: string
    address?: string
    city?: string
    isActive: boolean
    createdAt: string
    _count: {
        users: number
        stocks: number
        sales: number
    }
}

export function StoresManagement() {
    const [stores, setStores] = useState<Store[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<any>(null)
    const [search, setSearch] = useState('')
    const [filterCity, setFilterCity] = useState('')
    const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined)
    const [cities, setCities] = useState<string[]>([])

    // Modales
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedStore, setSelectedStore] = useState<Store | null>(null)

    // Notifications
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        loadStores()
        loadStats()
        loadCities()
    }, [search, filterCity, filterActive])

    const loadStores = async () => {
        setLoading(true)
        const response = await storeService.getStores(1, 50, search, filterActive, filterCity)
        if (response.success) {
            setStores(response.data.stores)
        }
        setLoading(false)
    }

    const loadStats = async () => {
        const response = await storeService.getStats()
        if (response.success) {
            setStats(response.data)
        }
    }

    const loadCities = async () => {
        const response = await storeService.getCities()
        if (response.success) {
            setCities(response.data)
        }
    }

    const handleToggleActive = async (storeId: string) => {
        const response = await storeService.toggleActive(storeId)
        if (response.success) {
            showSuccess('Statut du magasin modifié avec succès')
            loadStores()
            loadStats()
        } else {
            showError(response.message)
        }
    }

    const handleDeleteClick = (store: Store) => {
        setSelectedStore(store)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedStore) return

        const response = await storeService.deleteStore(selectedStore.id)
        if (response.success) {
            showSuccess('Magasin supprimé avec succès')
            loadStores()
            loadStats()
            setShowDeleteModal(false)
        } else {
            showError(response.message)
        }
    }

    const handleEdit = (store: Store) => {
        setSelectedStore(store)
        setShowEditModal(true)
    }

    const handleViewDetails = (store: Store) => {
        setSelectedStore(store)
        setShowDetailsModal(true)
    }

    const handleModalClose = () => {
        setShowCreateModal(false)
        setShowEditModal(false)
        setShowDetailsModal(false)
        setShowDeleteModal(false)
        setSelectedStore(null)
        loadStores()
        loadStats()
    }

    const showSuccess = (message: string) => {
        setSuccessMessage(message)
        setTimeout(() => setSuccessMessage(''), 5000)
    }

    const showError = (message: string) => {
        setErrorMessage(message)
        setTimeout(() => setErrorMessage(''), 5000)
    }

    return (
        <div className={`min-h-screen ${theme.background.dashboard}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* En-tête */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                🏪 Gestion des Magasins
                            </h1>
                            <p className="text-slate-600">
                                Gérez vos points de vente et leurs informations
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nouveau Magasin
                        </Button>
                    </div>

                    {/* Notifications */}
                    {successMessage && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errorMessage}
                        </div>
                    )}

                    {/* Statistiques */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <Card>
                                <div className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="text-sm text-slate-600">Total</p>
                                        <p className="text-2xl font-bold text-slate-900">{stats.totalStores}</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <div className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="text-sm text-slate-600">Actifs</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.activeStores}</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <div className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="text-sm text-slate-600">Avec Utilisateurs</p>
                                        <p className="text-2xl font-bold text-purple-600">{stats.storesWithUsers}</p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <div className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="text-sm text-slate-600">Avec Stocks</p>
                                        <p className="text-2xl font-bold text-orange-600">{stats.storesWithStocks}</p>
                                    </div>
                                    <div className="p-3 bg-orange-100 rounded-lg">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Filtres */}
                    <Card>
                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                    type="text"
                                    placeholder="🔍 Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <select
                                    value={filterCity}
                                    onChange={(e) => setFilterCity(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Toutes les villes</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>

                                <select
                                    value={filterActive === undefined ? '' : filterActive.toString()}
                                    onChange={(e) => setFilterActive(e.target.value === '' ? undefined : e.target.value === 'true')}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Tous les statuts</option>
                                    <option value="true">Actifs uniquement</option>
                                    <option value="false">Inactifs uniquement</option>
                                </select>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Liste des magasins */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-slate-600">Chargement...</p>
                        </div>
                    </div>
                ) : stores.length === 0 ? (
                    <Card>
                        <div className="p-12 text-center">
                            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun magasin trouvé</h3>
                            <p className="text-slate-600 mb-4">Commencez par créer votre premier magasin</p>
                            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                Créer un magasin
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.map((store) => (
                            <Card key={store.id} className="hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    {/* En-tête */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                                                {store.name}
                                            </h3>
                                            {store.city && (
                                                <p className="text-sm text-slate-600">
                                                    📍 {store.city}
                                                </p>
                                            )}
                                        </div>
                                        <Badge variant={store.isActive ? 'success' : 'danger'}>
                                            {store.isActive ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </div>

                                    {/* Informations */}
                                    <div className="space-y-2 mb-4">
                                        {store.email && (
                                            <div className="flex items-center text-sm text-slate-600">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {store.email}
                                            </div>
                                        )}
                                        {store.phone && (
                                            <div className="flex items-center text-sm text-slate-600">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                {store.phone}
                                            </div>
                                        )}
                                        {store.address && (
                                            <div className="flex items-start text-sm text-slate-600">
                                                <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="flex-1">{store.address}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Statistiques */}
                                    <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-slate-200">
                                        <div className="text-center">
                                            <p className="text-xs text-slate-600 mb-1">Utilisateurs</p>
                                            <p className="text-lg font-bold text-slate-900">{store._count.users}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-600 mb-1">Stocks</p>
                                            <p className="text-lg font-bold text-slate-900">{store._count.stocks}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-600 mb-1">Ventes</p>
                                            <p className="text-lg font-bold text-slate-900">{store._count.sales}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleViewDetails(store)}
                                            className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                                        >
                                            Détails
                                        </button>
                                        <button
                                            onClick={() => handleEdit(store)}
                                            className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(store.id)}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg transition ${store.isActive
                                                ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                                                : 'text-green-600 bg-green-50 hover:bg-green-100'
                                                }`}
                                        >
                                            {store.isActive ? 'Désactiver' : 'Activer'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(store)}
                                            className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                                            disabled={store._count.users > 0 || store._count.stocks > 0 || store._count.sales > 0}
                                            title={store._count.users > 0 || store._count.stocks > 0 || store._count.sales > 0 ? 'Impossible de supprimer un magasin avec des données' : 'Supprimer'}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Modales */}
            {showCreateModal && (
                <CreateStoreModal onClose={handleModalClose} />
            )}
            {showEditModal && selectedStore && (
                <EditStoreModal store={selectedStore} onClose={handleModalClose} />
            )}
            {showDetailsModal && selectedStore && (
                <StoreDetailsModal store={selectedStore} onClose={handleModalClose} />
            )}
            {showDeleteModal && selectedStore && (
                <DeleteStoreModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    store={selectedStore}
                />
            )}
        </div>
    )
}