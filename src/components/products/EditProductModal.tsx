import { useState, useEffect } from 'react'
import { productService } from '../../services/product.service'
import { categoryService } from '../../services/category.service'
import { supplierService } from '../../services/supplier.service'

interface Product {
    id: string
    name: string
    description?: string
    barcode?: string
    sku: string
    categoryId: string
    supplierId?: string
    costPrice: number
    sellingPrice: number
    minStock: number
    unit: string
}

interface EditProductModalProps {
    product: Product
    onClose: () => void
    onSuccess: () => void
}

interface Category {
    id: string
    name: string
}

interface Supplier {
    id: string
    name: string
}

export function EditProductModal({ product, onClose, onSuccess }: EditProductModalProps) {
    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description || '',
        barcode: product.barcode || '',
        sku: product.sku,
        categoryId: product.categoryId,
        supplierId: product.supplierId || '',
        costPrice: product.costPrice.toString(),
        sellingPrice: product.sellingPrice.toString(),
        minStock: product.minStock.toString(),
        unit: product.unit
    })
    const [categories, setCategories] = useState<Category[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [catRes, supRes] = await Promise.all([
                categoryService.getCategories(1, 100),
                supplierService.getSuppliers(1, 100)
            ])

            if (catRes.success) setCategories(catRes.data.categories)
            if (supRes.success) setSuppliers(supRes.data.suppliers)
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (error) setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const costPrice = parseFloat(formData.costPrice)
        const sellingPrice = parseFloat(formData.sellingPrice)

        if (sellingPrice < costPrice) {
            const confirmed = window.confirm(
                `⚠️ Le prix de vente (${sellingPrice} GNF) est inférieur au prix d'achat (${costPrice} GNF). Voulez-vous continuer ?`
            )
            if (!confirmed) {
                setLoading(false)
                return
            }
        }

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            barcode: formData.barcode.trim() || undefined,
            sku: formData.sku.trim().toUpperCase(),
            categoryId: formData.categoryId,
            supplierId: formData.supplierId || undefined,
            costPrice: parseFloat(formData.costPrice),
            sellingPrice: parseFloat(formData.sellingPrice),
            minStock: parseInt(formData.minStock),
            unit: formData.unit
        }

        try {
            const response = await productService.updateProduct(product.id, payload)
            if (response.success) {
                alert(response.message)
                onSuccess()
                onClose()
            } else {
                setError(response.message)
            }
        } catch (err: any) {
            setError(err.message || 'Erreur de connexion')
        } finally {
            setLoading(false)
        }
    }

    const margin = formData.costPrice && formData.sellingPrice
        ? parseFloat(formData.sellingPrice) - parseFloat(formData.costPrice)
        : 0

    const marginPercentage = formData.costPrice && margin
        ? ((margin / parseFloat(formData.costPrice)) * 100).toFixed(2)
        : '0'

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Modifier le produit</h2>
                            <p className="text-blue-100 text-sm">{product.name}</p>
                        </div>
                        <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nom *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">SKU *</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Code-barres</label>
                            <input
                                type="text"
                                name="barcode"
                                value={formData.barcode}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie *</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Fournisseur</label>
                            <select
                                name="supplierId"
                                value={formData.supplierId}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Aucun fournisseur</option>
                                {suppliers.map(sup => (
                                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Prix d'achat (GNF) *</label>
                            <input
                                type="number"
                                name="costPrice"
                                value={formData.costPrice}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Prix de vente (GNF) *</label>
                            <input
                                type="number"
                                name="sellingPrice"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {formData.costPrice && formData.sellingPrice && (
                            <div className="md:col-span-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-green-700 font-medium">Marge unitaire</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            {margin.toLocaleString('fr-FR')} GNF
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-green-700 font-medium">Marge (%)</p>
                                        <p className="text-2xl font-bold text-green-900">{marginPercentage}%</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Stock minimum</label>
                            <input
                                type="number"
                                name="minStock"
                                value={formData.minStock}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Unité</label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="pièce">Pièce</option>
                                <option value="kg">Kilogramme (kg)</option>
                                <option value="g">Gramme (g)</option>
                                <option value="litre">Litre</option>
                                <option value="mètre">Mètre</option>
                                <option value="boîte">Boîte</option>
                                <option value="carton">Carton</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? 'Modification...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}