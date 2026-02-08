import { useState, useEffect } from 'react'
import { theme } from '../../theme/theme'
import { supplierService } from '../../services/supplier.service'
import { SupplierForm } from '../../components/suppliers/SupplierForm'
import { SupplierDetailsModal } from '../../components/suppliers/SupplierDetailsModal'
import { DeleteSupplierModal } from '../../components/suppliers/DeleteSupplierModal'

interface Supplier {
    id: string
    name: string
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    country: string | null
    taxId: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string
    _count: {
        products: number
    }
}

interface Stats {
    totalSuppliers: number
    activeSuppliers: number
    inactiveSuppliers: number
    suppliersWithProducts: number
    suppliersWithoutProducts: number
    topSuppliers: Array<{
        id: string
        name: string
        email: string | null
        phone: string | null
        city: string | null
        country: string | null
        _count: { products: number }
    }>
}

export function SuppliersManagement() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined)
    const [filterCity, setFilterCity] = useState<string>('')
    const [filterCountry, setFilterCountry] = useState<string>('')
    const [cities, setCities] = useState<string[]>([])
    const [countries, setCountries] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    // États pour les modals
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Messages de feedback
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        fetchSuppliers()
        fetchStats()
        fetchCities()
        fetchCountries()
    }, [currentPage, searchTerm, filterActive, filterCity, filterCountry])

    const fetchSuppliers = async () => {
        setLoading(true)
        try {
            const response = await supplierService.getSuppliers(
                currentPage,
                50,
                searchTerm,
                filterActive,
                filterCity,
                filterCountry
            )
            if (response.success && response.data) {
                setSuppliers(response.data.suppliers)
                setTotalPages(response.data.pagination.totalPages)
                setTotal(response.data.pagination.total)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des fournisseurs:', error)
            showError('Erreur lors du chargement des fournisseurs')
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const response = await supplierService.getStats()
            if (response.success && response.data) {
                setStats(response.data)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error)
        }
    }

    const fetchCities = async () => {
        try {
            const response = await supplierService.getCities()
            if (response.success && response.data) {
                setCities(response.data)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des villes:', error)
        }
    }

    const fetchCountries = async () => {
        try {
            const response = await supplierService.getCountries()
            if (response.success && response.data) {
                setCountries(response.data)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des pays:', error)
        }
    }

    const handleCreate = () => {
        setSelectedSupplier(null)
        setShowCreateModal(true)
    }

    const handleEdit = (supplier: Supplier) => {
        setSelectedSupplier(supplier)
        setShowEditModal(true)
    }

    const handleViewDetails = (supplier: Supplier) => {
        setSelectedSupplier(supplier)
        setShowDetailsModal(true)
    }

    const handleToggleActive = async (supplier: Supplier) => {
        try {
            const response = await supplierService.toggleActive(supplier.id)
            if (response.success) {
                showSuccess(`Fournisseur ${response.data.isActive ? 'activé' : 'désactivé'} avec succès`)
                fetchSuppliers()
                fetchStats()
            } else {
                showError(response.message || 'Erreur lors du changement de statut')
            }
        } catch (error) {
            console.error('Erreur:', error)
            showError('Erreur lors du changement de statut')
        }
    }

    const handleDeleteClick = (supplier: Supplier) => {
        setSelectedSupplier(supplier)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedSupplier) return

        setDeleteLoading(true)
        try {
            const response = await supplierService.deleteSupplier(selectedSupplier.id)
            if (response.success) {
                showSuccess('Fournisseur supprimé avec succès')
                setShowDeleteModal(false)
                fetchSuppliers()
                fetchStats()
            } else {
                showError(response.message || 'Erreur lors de la suppression')
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error)
            showError('Erreur lors de la suppression')
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleFormSuccess = () => {
        setShowCreateModal(false)
        setShowEditModal(false)
        fetchSuppliers()
        fetchStats()
        fetchCities()
        fetchCountries()
    }

    const showSuccess = (message: string) => {
        setSuccessMessage(message)
        setTimeout(() => setSuccessMessage(''), 5000)
    }

    const showError = (message: string) => {
        setErrorMessage(message)
        setTimeout(() => setErrorMessage(''), 5000)
    }

    const clearFilters = () => {
        setSearchTerm('')
        setFilterActive(undefined)
        setFilterCity('')
        setFilterCountry('')
        setCurrentPage(1)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Fournisseurs</h1>
                        <p className="text-slate-600">Gérez vos fournisseurs et partenaires</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className={`${theme.button.base} ${theme.button.primary}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nouveau fournisseur
                    </button>
                </div>
            </div>

            {/* Messages de feedback */}
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className={theme.card.base}>
                        <div className={theme.card.body}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Total</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.totalSuppliers}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={theme.card.base}>
                        <div className={theme.card.body}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Actifs</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.activeSuppliers}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={theme.card.base}>
                        <div className={theme.card.body}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Inactifs</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.inactiveSuppliers}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={theme.card.base}>
                        <div className={theme.card.body}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Avec produits</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.suppliersWithProducts}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={theme.card.base}>
                        <div className={theme.card.body}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Top fournisseur</p>
                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                        {stats.topSuppliers[0]?.name || '-'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {stats.topSuppliers[0]?._count.products || 0} produits
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Barre de recherche et filtres */}
            <div className={`${theme.card.base} mb-6`}>
                <div className={theme.card.body}>
                    <div className="space-y-4">
                        {/* Recherche */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher un fournisseur (nom, email, téléphone, ville)..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <svg className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <div className="text-sm text-slate-600 whitespace-nowrap">
                                {total} fournisseur{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
                            </div>
                        </div>

                        {/* Filtres */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <select
                                value={filterActive === undefined ? '' : filterActive ? 'true' : 'false'}
                                onChange={(e) => {
                                    setFilterActive(e.target.value === '' ? undefined : e.target.value === 'true')
                                    setCurrentPage(1)
                                }}
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="true">Actifs</option>
                                <option value="false">Inactifs</option>
                            </select>

                            <select
                                value={filterCity}
                                onChange={(e) => {
                                    setFilterCity(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            >
                                <option value="">Toutes les villes</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>

                            <select
                                value={filterCountry}
                                onChange={(e) => {
                                    setFilterCountry(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            >
                                <option value="">Tous les pays</option>
                                {countries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>

                            {(searchTerm || filterActive !== undefined || filterCity || filterCountry) && (
                                <button
                                    onClick={clearFilters}
                                    className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                                >
                                    <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Effacer les filtres
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tableau des fournisseurs */}
            <div className={theme.card.base}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Fournisseur
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Localisation
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Produits
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-slate-500">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Chargement...
                                        </div>
                                    </td>
                                </tr>
                            ) : suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Aucun fournisseur trouvé
                                    </td>
                                </tr>
                            ) : (
                                suppliers.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">
                                                        {supplier.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800">{supplier.name}</div>
                                                    {supplier.taxId && (
                                                        <div className="text-xs text-slate-500">NIF: {supplier.taxId}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {supplier.email && (
                                                    <div className="text-sm text-slate-600 flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        {supplier.email}
                                                    </div>
                                                )}
                                                {supplier.phone && (
                                                    <div className="text-sm text-slate-600 flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        {supplier.phone}
                                                    </div>
                                                )}
                                                {!supplier.email && !supplier.phone && (
                                                    <span className="text-sm text-slate-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600">
                                                {supplier.city && supplier.country ? (
                                                    <>
                                                        <div className="font-medium">{supplier.city}</div>
                                                        <div className="text-xs text-slate-500">{supplier.country}</div>
                                                    </>
                                                ) : supplier.city ? (
                                                    supplier.city
                                                ) : supplier.country ? (
                                                    supplier.country
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier._count.products > 0
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {supplier._count.products}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleActive(supplier)}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition ${supplier.isActive
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    }`}
                                            >
                                                {supplier.isActive ? 'Actif' : 'Inactif'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(supplier)}
                                                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                                                    title="Voir détails"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(supplier)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(supplier)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Supprimer"
                                                    disabled={supplier._count.products > 0}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                            Page {currentPage} sur {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCreateModal && (
                <SupplierForm
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleFormSuccess}
                    onError={showError}
                />
            )}

            {showEditModal && selectedSupplier && (
                <SupplierForm
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleFormSuccess}
                    onError={showError}
                    supplier={selectedSupplier}
                />
            )}

            {showDeleteModal && selectedSupplier && (
                <DeleteSupplierModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    supplier={selectedSupplier}
                    loading={deleteLoading}
                />
            )}

            {showDetailsModal && selectedSupplier && (
                <SupplierDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    supplier={selectedSupplier}
                />
            )}
        </div>
    )
}