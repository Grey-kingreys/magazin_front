import { useState, useEffect } from 'react'
import { productService } from '../../services/product.service'
import { categoryService } from '../../services/category.service'
import { supplierService } from '../../services/supplier.service'

interface CreateProductModalProps {
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

export function CreateProductModal({ onClose, onSuccess }: CreateProductModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        barcode: '',
        sku: '',
        categoryId: '',
        supplierId: '',
        costPrice: '',
        sellingPrice: '',
        minStock: '0',
        unit: 'pièce'
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

    const validateForm = () => {
        if (!formData.name.trim() || formData.name.length < 2) {
            setError('Le nom doit contenir au moins 2 caractères')
            return false
        }

        if (!formData.sku.trim() || formData.sku.length < 2) {
            setError('Le SKU est obligatoire')
            return false
        }

        if (!formData.categoryId) {
            setError('La catégorie est obligatoire')
            return false
        }

        const costPrice = parseFloat(formData.costPrice)
        const sellingPrice = parseFloat(formData.sellingPrice)

        if (!costPrice || costPrice <= 0) {
            setError("Le prix d'achat doit être supérieur à 0")
            return false
        }

        if (!sellingPrice || sellingPrice <= 0) {
            setError('Le prix de vente doit être supérieur à 0')
            return false
        }

        if (sellingPrice < costPrice) {
            const confirmed = window.confirm(
                `⚠️ Le prix de vente (${sellingPrice} GNF) est inférieur au prix d'achat (${costPrice} GNF). Voulez-vous continuer ?`
            )
            if (!confirmed) return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) return

        setLoading(true)

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            barcode: formData.barcode.trim() || undefined,
            sku: formData.sku.trim().toUpperCase(),
            categoryId: formData.categoryId,
            supplierId: formData.supplierId || undefined,
            costPrice: parseFloat(formData.costPrice),
            sellingPrice: parseFloat(formData.sellingPrice),
            minStock: parseInt(formData.minStock) || 0,
            unit: formData.unit.trim() || 'pièce'
        }

        try {
            const response = await productService.createProduct(payload)
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

    // Calcul de la marge
    const margin = formData.costPrice && formData.sellingPrice
        ? parseFloat(formData.sellingPrice) - parseFloat(formData.costPrice)
        : 0

    const marginPercentage = formData.costPrice && margin
        ? ((margin / parseFloat(formData.costPrice)) * 100).toFixed(2)
        : '0'

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Nouveau Produit</h2>
                                <p className="text-blue-100 text-sm">Ajouter un produit au catalogue</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Nom */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nom du produit *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Ex: iPhone 15 Pro Max 256GB"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Description détaillée du produit..."
                            />
                        </div>

                        {/* SKU */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                SKU (Référence) *
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                                placeholder="IPH-15-PM-256-BLK"
                            />
                            <p className="text-xs text-slate-500 mt-1">Majuscules, chiffres, tirets uniquement</p>
                        </div>

                        {/* Code-barres */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Code-barres
                            </label>
                            <input
                                type="text"
                                name="barcode"
                                value={formData.barcode}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="0194253777564"
                            />
                        </div>

                        {/* Catégorie */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Catégorie *
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Sélectionner une catégorie</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Fournisseur */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Fournisseur
                            </label>
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

                        {/* Prix d'achat */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Prix d'achat (GNF) *
                            </label>
                            <input
                                type="number"
                                name="costPrice"
                                value={formData.costPrice}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="950000"
                            />
                        </div>

                        {/* Prix de vente */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Prix de vente (GNF) *
                            </label>
                            <input
                                type="number"
                                name="sellingPrice"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="1200000"
                            />
                        </div>

                        {/* Marge */}
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
                                        <p className="text-2xl font-bold text-green-900">
                                            {marginPercentage}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stock minimum */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Seuil d'alerte (stock min)
                            </label>
                            <input
                                type="number"
                                name="minStock"
                                value={formData.minStock}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="5"
                            />
                        </div>

                        {/* Unité */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Unité de mesure
                            </label>
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

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-6 border-t mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'Création...' : 'Créer le produit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}