import { useState, useEffect } from 'react'
import { stockService } from '../../services/stock.service'
import { productService } from '../../services/product.service'
import { storeService } from '../../services/store.service'

interface CreateStockModalProps {
    onClose: () => void
    onSuccess: () => void
}

interface Product {
    id: string
    name: string
    sku: string
}

interface Store {
    id: string
    name: string
    city: string
}

export function CreateStockModal({ onClose, onSuccess }: CreateStockModalProps) {
    const [formData, setFormData] = useState({
        productId: '',
        storeId: '',
        quantity: '0'
    })
    const [products, setProducts] = useState<Product[]>([])
    const [stores, setStores] = useState<Store[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [prodRes, storeRes] = await Promise.all([
                productService.getProducts(1, 100),
                storeService.getStores(1, 100)
            ])

            if (prodRes.success) setProducts(prodRes.data.products)
            if (storeRes.success) setStores(storeRes.data.stores)
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (error) setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.productId) {
            setError('Veuillez sélectionner un produit')
            return
        }

        if (!formData.storeId) {
            setError('Veuillez sélectionner un magasin')
            return
        }

        const quantity = parseInt(formData.quantity)
        if (quantity < 0) {
            setError('La quantité ne peut pas être négative')
            return
        }

        setLoading(true)

        try {
            const response = await stockService.createStock({
                productId: formData.productId,
                storeId: formData.storeId,
                quantity
            })

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

    const selectedProduct = products.find(p => p.id === formData.productId)

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Initialiser un Stock</h2>
                                <p className="text-green-100 text-sm">Ajouter un produit à un magasin</p>
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
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Produit */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Produit *
                        </label>
                        <select
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Sélectionner un produit</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} ({product.sku})
                                </option>
                            ))}
                        </select>
                        {selectedProduct && (
                            <p className="text-xs text-slate-500 mt-1">
                                SKU: {selectedProduct.sku}
                            </p>
                        )}
                    </div>

                    {/* Magasin */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Magasin *
                        </label>
                        <select
                            name="storeId"
                            value={formData.storeId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Sélectionner un magasin</option>
                            {stores.map(store => (
                                <option key={store.id} value={store.id}>
                                    {store.name} - {store.city}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantité */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Quantité initiale *
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="0"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Quantité disponible dans ce magasin
                        </p>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-sm text-blue-800 font-medium">Information</p>
                                <p className="text-xs text-blue-700 mt-1">
                                    Cette action initialise le stock d'un produit dans un magasin.
                                    Pour les mouvements ultérieurs, utilisez les entrées/sorties de stock.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t">
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
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'Création...' : 'Créer le stock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}