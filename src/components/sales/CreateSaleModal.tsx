import { useState, useEffect } from 'react'
import { saleService } from '../../services/sale.service'
import { productService } from '../../services/product.service'
import { storeService } from '../../services/store.service'

interface CreateSaleModalProps {
    onClose: () => void
    onSuccess: () => void
}

interface Product {
    id: string
    name: string
    sku: string
    sellingPrice: number
    unit: string
}

interface Store {
    id: string
    name: string
    city: string
}

interface SaleItem {
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    subtotal: number
}

export function CreateSaleModal({ onClose, onSuccess }: CreateSaleModalProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [stores, setStores] = useState<Store[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Formulaire
    const [storeId, setStoreId] = useState('')
    const [items, setItems] = useState<SaleItem[]>([])
    const [selectedProduct, setSelectedProduct] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [discount, setDiscount] = useState(0)
    const [tax, setTax] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'MOBILE_MONEY' | 'CHECK'>('CASH')
    const [amountPaid, setAmountPaid] = useState(0)
    const [notes, setNotes] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [productsRes, storesRes] = await Promise.all([
                productService.getProducts(1, 1000, undefined, undefined, undefined, true),
                storeService.getStores(1, 100)
            ])

            if (productsRes.success) {
                setProducts(productsRes.data.products)
            }
            if (storesRes.success) {
                setStores(storesRes.data.stores)
            }
        } catch (err) {
            console.error('Erreur:', err)
            setError('Erreur lors du chargement des données')
        }
    }

    // Calculs automatiques
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const total = subtotal - discount + tax
    const change = amountPaid - total

    const handleAddItem = () => {
        if (!selectedProduct) {
            setError('Veuillez sélectionner un produit')
            return
        }

        if (quantity < 1) {
            setError('La quantité doit être au moins 1')
            return
        }

        const product = products.find(p => p.id === selectedProduct)
        if (!product) return

        // Vérifier si le produit existe déjà dans la liste
        const existingItemIndex = items.findIndex(item => item.productId === selectedProduct)

        if (existingItemIndex !== -1) {
            // Mettre à jour la quantité
            const updatedItems = [...items]
            updatedItems[existingItemIndex].quantity += quantity
            updatedItems[existingItemIndex].subtotal = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitPrice
            setItems(updatedItems)
        } else {
            // Ajouter nouveau produit
            const newItem: SaleItem = {
                productId: product.id,
                productName: product.name,
                quantity,
                unitPrice: product.sellingPrice,
                subtotal: quantity * product.sellingPrice
            }
            setItems([...items, newItem])
        }

        // Reset
        setSelectedProduct('')
        setQuantity(1)
        setError('')
    }

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const handleUpdateQuantity = (index: number, newQuantity: number) => {
        if (newQuantity < 1) return

        const updatedItems = [...items]
        updatedItems[index].quantity = newQuantity
        updatedItems[index].subtotal = newQuantity * updatedItems[index].unitPrice
        setItems(updatedItems)
    }

    const validateForm = () => {
        if (!storeId) {
            setError('Veuillez sélectionner un magasin')
            return false
        }

        if (items.length === 0) {
            setError('Veuillez ajouter au moins un article')
            return false
        }

        if (amountPaid < total) {
            setError(`Montant insuffisant. Total: ${total.toLocaleString()} GNF`)
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) return

        setLoading(true)

        try {
            const payload = {
                storeId,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                })),
                discount,
                tax,
                paymentMethod,
                amountPaid,
                notes: notes.trim() || undefined
            }

            const response = await saleService.createSale(payload)

            if (response.success) {
                alert(`✅ ${response.message}\nNuméro de vente: ${response.data.saleNumber}`)
                onSuccess()
                onClose()
            } else {
                setError(response.message)
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la création de la vente')
        } finally {
            setLoading(false)
        }
    }

    // Auto-fill montant payé quand le total change
    useEffect(() => {
        if (amountPaid === 0 || amountPaid < total) {
            setAmountPaid(total)
        }
    }, [total])

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">🛒 Nouvelle Vente (POS)</h2>
                                <p className="text-green-100 text-sm">Point de vente - Caisse</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Colonne gauche - Sélection produits */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">📦 Ajouter des articles</h3>

                                {/* Magasin */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Magasin *
                                    </label>
                                    <select
                                        value={storeId}
                                        onChange={(e) => setStoreId(e.target.value)}
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

                                {/* Sélection produit */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Produit
                                        </label>
                                        <select
                                            value={selectedProduct}
                                            onChange={(e) => setSelectedProduct(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="">Choisir un produit</option>
                                            {products.map(product => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} - {product.sellingPrice.toLocaleString()} GNF
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Quantité
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    className="mt-3 w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Ajouter à la vente
                                </button>
                            </div>

                            {/* Liste des articles */}
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                                    <h3 className="font-semibold text-slate-800">Articles ({items.length})</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {items.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500">
                                            Aucun article ajouté
                                        </div>
                                    ) : (
                                        <table className="w-full">
                                            <thead className="bg-slate-50 sticky top-0">
                                                <tr>
                                                    <th className="text-left py-2 px-4 text-xs font-semibold text-slate-600">Produit</th>
                                                    <th className="text-center py-2 px-4 text-xs font-semibold text-slate-600">Qté</th>
                                                    <th className="text-right py-2 px-4 text-xs font-semibold text-slate-600">Prix U.</th>
                                                    <th className="text-right py-2 px-4 text-xs font-semibold text-slate-600">Sous-total</th>
                                                    <th className="py-2 px-4"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {items.map((item, index) => (
                                                    <tr key={index} className="hover:bg-slate-50">
                                                        <td className="py-2 px-4 text-sm text-slate-800">{item.productName}</td>
                                                        <td className="py-2 px-4">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={item.quantity}
                                                                onChange={(e) => handleUpdateQuantity(index, Number(e.target.value))}
                                                                className="w-16 px-2 py-1 text-center border border-slate-300 rounded text-sm"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-4 text-sm text-right text-slate-600">
                                                            {item.unitPrice.toLocaleString()} GNF
                                                        </td>
                                                        <td className="py-2 px-4 text-sm text-right font-semibold text-slate-800">
                                                            {item.subtotal.toLocaleString()} GNF
                                                        </td>
                                                        <td className="py-2 px-4 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveItem(index)}
                                                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Colonne droite - Paiement */}
                        <div className="space-y-4">
                            {/* Résumé */}
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-slate-800 mb-3">💰 Résumé</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Sous-total</span>
                                        <span className="font-semibold">{subtotal.toLocaleString()} GNF</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">Remise</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={discount}
                                            onChange={(e) => setDiscount(Number(e.target.value))}
                                            className="w-28 px-2 py-1 text-right border border-slate-300 rounded text-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">Taxe</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={tax}
                                            onChange={(e) => setTax(Number(e.target.value))}
                                            className="w-28 px-2 py-1 text-right border border-slate-300 rounded text-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="border-t border-slate-300 pt-2 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-800 text-base">TOTAL</span>
                                            <span className="font-bold text-green-600 text-xl">{total.toLocaleString()} GNF</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Méthode de paiement */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Méthode de paiement *
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { value: 'CASH', label: '💵 Espèces', color: 'green' },
                                        { value: 'CARD', label: '💳 Carte', color: 'blue' },
                                        { value: 'MOBILE_MONEY', label: '📱 Mobile Money', color: 'purple' },
                                        { value: 'CHECK', label: '📄 Chèque', color: 'orange' }
                                    ].map((method) => (
                                        <button
                                            key={method.value}
                                            type="button"
                                            onClick={() => setPaymentMethod(method.value as any)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${paymentMethod === method.value
                                                    ? `bg-${method.color}-600 text-white`
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            {method.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Montant payé */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Montant payé *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={amountPaid}
                                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                                />
                                {change >= 0 && (
                                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-blue-700 font-medium">Monnaie à rendre</span>
                                            <span className="text-lg font-bold text-blue-800">{change.toLocaleString()} GNF</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Notes (optionnel)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    maxLength={500}
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                    placeholder="Remarques sur la vente..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading || items.length === 0}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 font-semibold"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Traitement...
                                </span>
                            ) : (
                                '✅ Finaliser la vente'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}