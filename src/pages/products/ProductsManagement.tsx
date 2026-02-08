import { useEffect, useState } from 'react'
import { productService } from '../../services/product.service'
import { categoryService } from '../../services/category.service'
import { supplierService } from '../../services/supplier.service'
import { CreateProductModal } from '../../components/products/CreateProductModal'
import { EditProductModal } from '../../components/products/EditProductModal'
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal'
import { theme } from '../../theme/theme'

interface Product {
    id: string
    name: string
    description?: string
    sku: string
    barcode?: string
    categoryId: string
    supplierId?: string
    costPrice: number
    sellingPrice: number
    minStock: number
    unit: string
    isActive: boolean
    margin: number
    marginPercentage: number
    totalStock: number
    isLowStock: boolean
    category: { id: string; name: string }
    supplier?: { id: string; name: string }
}

export function ProductsManagement() {
    const [products, setProducts] = useState<Product[]>([])
    const [stats, setStats] = useState<any>(null)
    const [categories, setCategories] = useState<any[]>([])
    const [suppliers, setSuppliers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Filtres
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('')
    const [filterSupplier, setFilterSupplier] = useState('')
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [filterLowStock, setFilterLowStock] = useState(false)

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Messages
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        fetchData()
    }, [searchTerm, filterCategory, filterSupplier, filterStatus, filterLowStock])

    const fetchData = async () => {
        setLoading(true)
        try {
            const isActive = filterStatus === 'ACTIVE' ? true : filterStatus === 'INACTIVE' ? false : undefined

            const [productsRes, statsRes, catRes, supRes] = await Promise.all([
                productService.getProducts(
                    1, 100,
                    searchTerm,
                    filterCategory,
                    filterSupplier,
                    isActive,
                    filterLowStock
                ),
                productService.getStats(),
                categoryService.getCategories(1, 100),
                supplierService.getSuppliers(1, 100)
            ])

            if (productsRes.success) setProducts(productsRes.data.products)
            if (statsRes.success) setStats(statsRes.data)
            if (catRes.success) setCategories(catRes.data.categories)
            if (supRes.success) setSuppliers(supRes.data.suppliers)
        } catch (error) {
            console.error('Erreur:', error)
            showError('Erreur lors du chargement des données')
        } finally {
            setLoading(false)
        }
    }

    const handleToggleActive = async (product: Product) => {
        const confirmed = window.confirm(
            `Voulez-vous ${product.isActive ? 'désactiver' : 'activer'} "${product.name}" ?`
        )
        if (!confirmed) return

        try {
            const response = await productService.toggleActive(product.id)
            if (response.success) {
                showSuccess(response.message)
                fetchData()
            } else {
                showError(response.message)
            }
        } catch (error) {
            showError('Erreur lors du changement de statut')
        }
    }

    const handleDeleteClick = (product: Product) => {
        setSelectedProduct(product)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return

        setDeleteLoading(true)
        try {
            const response = await productService.deleteProduct(selectedProduct.id)
            if (response.success) {
                showSuccess(`Produit "${selectedProduct.name}" supprimé`)
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
                    <h2 className="text-2xl font-bold text-slate-800">Gestion des Produits</h2>
                    <p className="text-slate-600 mt-1">Catalogue complet des produits</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className={`${theme.button.base} ${theme.button.primary}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouveau Produit
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
                        <p className="text-sm text-slate-600">Total Produits</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalProducts}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                        <p className="text-sm text-green-700">Actifs</p>
                        <p className="text-3xl font-bold text-green-900">{stats.activeProducts}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                        <p className="text-sm text-red-700">Stock Faible</p>
                        <p className="text-3xl font-bold text-red-900">{stats.lowStockCount}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                        <p className="text-sm text-blue-700">Inactifs</p>
                        <p className="text-3xl font-bold text-blue-900">{stats.inactiveProducts}</p>
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rechercher</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nom, SKU, code-barres..."
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
                            <option value="">Toutes</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Fournisseur</label>
                        <select
                            value={filterSupplier}
                            onChange={(e) => setFilterSupplier(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Tous</option>
                            {suppliers.map(sup => (
                                <option key={sup.id} value={sup.id}>{sup.name}</option>
                            ))}
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
                <div className="mt-3 flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filterLowStock}
                            onChange={(e) => setFilterLowStock(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Afficher uniquement les produits en stock faible</span>
                    </label>
                </div>
            </div>

            {/* Liste des produits */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Produit</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Catégorie</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Prix Achat</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Prix Vente</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Marge</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Stock</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Statut</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-slate-500">
                                        Aucun produit trouvé
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition">
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-slate-900">{product.name}</p>
                                                <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                {product.category.name}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right text-sm text-slate-600">
                                            {product.costPrice.toLocaleString('fr-FR')} GNF
                                        </td>
                                        <td className="py-3 px-4 text-right text-sm font-medium text-slate-900">
                                            {product.sellingPrice.toLocaleString('fr-FR')} GNF
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="text-sm font-medium text-green-700">
                                                +{product.marginPercentage}%
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {product.margin.toLocaleString('fr-FR')} GNF
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {product.isLowStock ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {product.totalStock}
                                                </span>
                                            ) : (
                                                <span className="text-sm font-medium text-slate-900">{product.totalStock}</span>
                                            )}
                                            <p className="text-xs text-slate-500 mt-0.5">{product.unit}</p>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {product.isActive ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                    Actif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                                                    Inactif
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product)
                                                        setShowEditModal(true)
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(product)}
                                                    className={`p-2 rounded-lg transition ${product.isActive
                                                            ? 'text-orange-600 hover:bg-orange-50'
                                                            : 'text-green-600 hover:bg-green-50'
                                                        }`}
                                                    title={product.isActive ? 'Désactiver' : 'Activer'}
                                                >
                                                    {product.isActive ? (
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
                                                    onClick={() => handleDeleteClick(product)}
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
                <CreateProductModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={fetchData}
                />
            )}

            {showEditModal && selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    onClose={() => {
                        setShowEditModal(false)
                        setSelectedProduct(null)
                    }}
                    onSuccess={fetchData}
                />
            )}

            {showDeleteModal && selectedProduct && (
                <DeleteConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Supprimer le produit"
                    message={`Êtes-vous sûr de vouloir supprimer "${selectedProduct.name}" ?`}
                    itemName={selectedProduct.name}
                    loading={deleteLoading}
                />
            )}
        </div>
    )
}