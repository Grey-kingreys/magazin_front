import { useState, useEffect } from 'react'
import { stockMovementService } from '../../services/stock-movement.service'
import { storeService } from '../../services/store.service'
import { productService } from '../../services/product.service'

interface EditStockMovementModalProps {
    movement: {
        id: string
        type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT'
        quantity: number
        reference?: string
        notes?: string
        product: {
            id: string
            name: string
            sku: string
            unit: string
        }
        store: {
            id: string
            name: string
            city: string
        }
        fromStoreId?: string
        toStoreId?: string
    }
    onClose: () => void
    onSuccess: () => void
}

interface Store {
    id: string
    name: string
    city: string
}

interface Product {
    id: string
    name: string
    sku: string
    unit: string
}

export function EditStockMovementModal({ movement, onClose, onSuccess }: EditStockMovementModalProps) {
    const [formData, setFormData] = useState({
        type: movement.type,
        quantity: movement.quantity.toString(),
        reference: movement.reference || '',
        notes: movement.notes || '',
        storeId: movement.store.id,
        fromStoreId: movement.fromStoreId || '',
        toStoreId: movement.toStoreId || ''
    })

    const [stores, setStores] = useState<Store[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [storesRes, productsRes] = await Promise.all([
                storeService.getStores(),
                productService.getProducts()
            ])

            if (storesRes.success) setStores(storesRes.data.stores)
            if (productsRes.success) setProducts(productsRes.data.products)
        } catch (error) {
            console.error('Erreur:', error)
            setError('Erreur lors du chargement des données')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        if (error) setError('')
    }

    const validateForm = () => {
        if (!formData.quantity || Number(formData.quantity) <= 0) {
            setError('La quantité doit être supérieure à 0')
            return false
        }

        if (formData.type === 'TRANSFER') {
            if (!formData.fromStoreId) {
                setError('Le magasin source est obligatoire pour un transfert')
                return false
            }
            if (!formData.toStoreId) {
                setError('Le magasin destination est obligatoire pour un transfert')
                return false
            }
            if (formData.fromStoreId === formData.toStoreId) {
                setError('Les magasins source et destination doivent être différents')
                return false
            }
        } else {
            if (!formData.storeId) {
                setError('Le magasin est obligatoire')
                return false
            }
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) return

        setIsSubmitting(true)

        const payload: any = {
            type: formData.type,
            quantity: Number(formData.quantity),
        }

        if (formData.reference) payload.reference = formData.reference
        if (formData.notes) payload.notes = formData.notes

        if (formData.type === 'TRANSFER') {
            payload.fromStoreId = formData.fromStoreId
            payload.toStoreId = formData.toStoreId
            payload.storeId = formData.fromStoreId
        } else {
            payload.storeId = formData.storeId
        }

        try {
            const response = await stockMovementService.updateMovement(movement.id, payload)

            if (response.success) {
                onSuccess()
                onClose()
            } else {
                setError(response.message || 'Erreur lors de la modification')
            }
        } catch (err: any) {
            console.error('Erreur:', err)
            setError(err.message || 'Erreur de connexion au serveur')
        } finally {
            setIsSubmitting(false)
        }
    }

    const getTypeLabel = () => {
        const labels = {
            IN: { title: 'Entrée de Stock', desc: 'Réception de produits', icon: '📥' },
            OUT: { title: 'Sortie de Stock', desc: 'Expédition ou utilisation', icon: '📤' },
            TRANSFER: { title: 'Transfert Inter-Magasins', desc: 'Déplacement entre magasins', icon: '🔄' },
            ADJUSTMENT: { title: 'Ajustement d\'Inventaire', desc: 'Correction manuelle', icon: '⚖️' }
        }
        return labels[formData.type]
    }

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8">
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                                {getTypeLabel().icon}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Modifier le Mouvement</h2>
                                <p className="text-blue-100 text-sm">ID: {movement.id}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                        >
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

                    {/* Type de mouvement */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Type de mouvement *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {(['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'] as const).map((type) => {
                                const labels = {
                                    IN: { label: 'Entrée', color: 'border-green-500 bg-green-50 text-green-700', icon: '📥' },
                                    OUT: { label: 'Sortie', color: 'border-red-500 bg-red-50 text-red-700', icon: '📤' },
                                    TRANSFER: { label: 'Transfert', color: 'border-blue-500 bg-blue-50 text-blue-700', icon: '🔄' },
                                    ADJUSTMENT: { label: 'Ajustement', color: 'border-purple-500 bg-purple-50 text-purple-700', icon: '⚖️' }
                                }
                                const config = labels[type]
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type }))}
                                        className={`p-3 border-2 rounded-lg transition ${formData.type === type
                                            ? config.color
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{config.icon}</div>
                                        <div className="text-xs font-medium">{config.label}</div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Produit (non modifiable) */}
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Produit
                        </label>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900">{movement.product.name}</p>
                                <p className="text-sm text-slate-600">SKU: {movement.product.sku}</p>
                            </div>
                            <span className="text-sm text-slate-500">(non modifiable)</span>
                        </div>
                    </div>

                    {/* Magasins selon le type */}
                    {formData.type === 'TRANSFER' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Magasin source *
                                </label>
                                <select
                                    name="fromStoreId"
                                    value={formData.fromStoreId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Sélectionner</option>
                                    {stores.map(store => (
                                        <option key={store.id} value={store.id}>
                                            {store.name} - {store.city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Magasin destination *
                                </label>
                                <select
                                    name="toStoreId"
                                    value={formData.toStoreId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Sélectionner</option>
                                    {stores.map(store => (
                                        <option key={store.id} value={store.id}>
                                            {store.name} - {store.city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Magasin *
                            </label>
                            <select
                                name="storeId"
                                value={formData.storeId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Sélectionner un magasin</option>
                                {stores.map(store => (
                                    <option key={store.id} value={store.id}>
                                        {store.name} - {store.city}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Quantité */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Quantité * ({movement.product.unit})
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="1"
                            step="1"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ex: 50"
                        />
                    </div>

                    {/* Référence */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Référence (optionnel)
                        </label>
                        <input
                            type="text"
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            maxLength={100}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ex: BL-2024-001"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Numéro de bon de livraison, facture, etc.
                        </p>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Notes (optionnel)
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            maxLength={500}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            placeholder="Commentaires ou observations..."
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {formData.notes.length}/500 caractères
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Modification...
                                </span>
                            ) : (
                                'Modifier le mouvement'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}