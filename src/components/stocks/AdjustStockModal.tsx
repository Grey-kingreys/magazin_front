import { useState } from 'react'
import { stockService } from '../../services/stock.service'

interface Stock {
    id: string
    quantity: number
    product: {
        id: string
        name: string
        sku: string
        minStock: number
        unit: string
    }
    store: {
        id: string
        name: string
        city: string
    }
}

interface AdjustStockModalProps {
    stock: Stock
    onClose: () => void
    onSuccess: () => void
}

export function AdjustStockModal({ stock, onClose, onSuccess }: AdjustStockModalProps) {
    const [quantity, setQuantity] = useState(stock.quantity.toString())
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const newQuantity = parseInt(quantity)
        if (newQuantity < 0) {
            setError('La quantité ne peut pas être négative')
            return
        }

        if (newQuantity === stock.quantity) {
            setError('Aucun changement détecté')
            return
        }

        // Avertissement si stock faible
        if (newQuantity <= stock.product.minStock) {
            const confirmed = window.confirm(
                `⚠️ Cette quantité (${newQuantity}) est inférieure ou égale au seuil d'alerte (${stock.product.minStock}). Voulez-vous continuer ?`
            )
            if (!confirmed) return
        }

        setLoading(true)

        try {
            const response = await stockService.updateStock(stock.id, newQuantity)
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

    const difference = parseInt(quantity) - stock.quantity
    const isDifferent = difference !== 0

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Ajuster le Stock</h2>
                            <p className="text-purple-100 text-sm">{stock.product.name}</p>
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

                    {/* Info du produit */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500">Produit</p>
                                <p className="text-sm font-medium text-slate-900">{stock.product.name}</p>
                                <p className="text-xs text-slate-500">SKU: {stock.product.sku}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Magasin</p>
                                <p className="text-sm font-medium text-slate-900">{stock.store.name}</p>
                                <p className="text-xs text-slate-500">{stock.store.city}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stock actuel */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-700 font-medium">Stock actuel</p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Seuil d'alerte: {stock.product.minStock} {stock.product.unit}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-blue-900">
                                    {stock.quantity}
                                </p>
                                <p className="text-sm text-blue-700">{stock.product.unit}</p>
                            </div>
                        </div>
                    </div>

                    {/* Nouvelle quantité */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nouvelle quantité *
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            min="0"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-medium"
                            placeholder="0"
                        />
                        <p className="text-xs text-slate-500 mt-1">Unité: {stock.product.unit}</p>
                    </div>

                    {/* Différence */}
                    {isDifferent && (
                        <div className={`border rounded-lg p-4 ${difference > 0
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}>
                            <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${difference > 0 ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                    {difference > 0 ? 'Augmentation' : 'Diminution'}
                                </p>
                                <p className={`text-2xl font-bold ${difference > 0 ? 'text-green-900' : 'text-red-900'
                                    }`}>
                                    {difference > 0 ? '+' : ''}{difference} {stock.product.unit}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Avertissement stock faible */}
                    {parseInt(quantity) <= stock.product.minStock && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-sm text-amber-800 font-medium">⚠️ Stock faible</p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        La quantité est inférieure ou égale au seuil d'alerte ({stock.product.minStock})
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

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
                            disabled={loading || !isDifferent}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'Ajustement...' : 'Ajuster le stock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}