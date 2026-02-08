import { useState, useEffect } from 'react'
import { theme } from '../../theme/theme'
import { categoryService } from '../../services/category.service'
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal'
import { CategoryForm } from './CategoryForm'

interface Category {
    id: string
    name: string
    description: string | null
    createdAt: string
    updatedAt: string
    _count: {
        products: number
    }
}

interface Stats {
    totalCategories: number
    categoriesWithProducts: number
    emptyCategories: number
    topCategories: Array<{
        id: string
        name: string
        _count: { products: number }
    }>
}

export function CategoriesManagement() {
    const [categories, setCategories] = useState<Category[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    // États pour les modals
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Messages de feedback
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        fetchCategories()
        fetchStats()
    }, [currentPage, searchTerm])

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await categoryService.getCategories(currentPage, 50, searchTerm)
            if (response.success && response.data) {
                setCategories(response.data.categories)
                setTotalPages(response.data.pagination.totalPages)
                setTotal(response.data.pagination.total)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des catégories:', error)
            showError('Erreur lors du chargement des catégories')
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const response = await categoryService.getStats()
            if (response.success && response.data) {
                setStats(response.data)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error)
        }
    }

    const handleCreate = () => {
        setSelectedCategory(null)
        setShowCreateModal(true)
    }

    const handleEdit = (category: Category) => {
        setSelectedCategory(category)
        setShowEditModal(true)
    }

    const handleDeleteClick = (category: Category) => {
        setSelectedCategory(category)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedCategory) return

        setDeleteLoading(true)
        try {
            const response = await categoryService.deleteCategory(selectedCategory.id)
            if (response.success) {
                showSuccess('Catégorie supprimée avec succès')
                setShowDeleteModal(false)
                fetchCategories()
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
        fetchCategories()
        fetchStats()
    }

    const showSuccess = (message: string) => {
        setSuccessMessage(message)
        setTimeout(() => setSuccessMessage(''), 5000)
    }

    const showError = (message: string) => {
        setErrorMessage(message)
        setTimeout(() => setErrorMessage(''), 5000)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Catégories</h1>
                        <p className="text-slate-600">Gérez les catégories de produits</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className={`${theme.button.base} ${theme.button.primary}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nouvelle catégorie
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className={theme.card.base}>
                        <div className={theme.card.body}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Total</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.totalCategories}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
                                    <p className="text-2xl font-bold text-slate-900">{stats.categoriesWithProducts}</p>
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
                                    <p className="text-sm text-slate-600 mb-1">Vides</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.emptyCategories}</p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={theme.card.base}>
                        <div className={theme.card.body}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Top catégorie</p>
                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                        {stats.topCategories[0]?.name || '-'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {stats.topCategories[0]?._count.products || 0} produits
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Barre de recherche */}
            <div className={`${theme.card.base} mb-6`}>
                <div className={theme.card.body}>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Rechercher une catégorie..."
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
                        <div className="text-sm text-slate-600">
                            {total} catégorie{total > 1 ? 's' : ''} trouvée{total > 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tableau des catégories */}
            <div className={theme.card.base}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Produits
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Date de création
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-slate-500">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Chargement...
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        Aucune catégorie trouvée
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">
                                                        {category.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800">{category.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 max-w-xs truncate">
                                                {category.description || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category._count.products > 0
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {category._count.products}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-slate-600">
                                            {formatDate(category.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(category)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Supprimer"
                                                    disabled={category._count.products > 0}
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
                <CategoryForm
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleFormSuccess}
                    onError={showError}
                />
            )}

            {showEditModal && selectedCategory && (
                <CategoryForm
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleFormSuccess}
                    onError={showError}
                    category={selectedCategory}
                />
            )}

            {showDeleteModal && selectedCategory && (
                <DeleteConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Supprimer la catégorie"
                    message="Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible."
                    itemName={selectedCategory.name}
                    loading={deleteLoading}
                />
            )}
        </div>
    )
}