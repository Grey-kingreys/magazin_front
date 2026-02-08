import { theme } from '../../theme/theme'

interface Sale {
    id: string
    saleNumber: string
    storeId: string
    userId: string
    subtotal: number
    discount: number
    tax: number
    total: number
    paymentMethod: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'CHECK'
    amountPaid: number
    change: number
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
    notes?: string
    createdAt: string
    store: {
        id: string
        name: string
        city: string
    }
    user: {
        id: string
        name: string
        email: string
    }
    items: Array<{
        id: string
        productId: string
        quantity: number
        unitPrice: number
        subtotal: number
        product: {
            id: string
            name: string
            sku: string
            unit: string
        }
    }>
}

interface SaleDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    sale: Sale
}

export function SaleDetailsModal({ isOpen, onClose, sale }: SaleDetailsModalProps) {
    if (!isOpen) return null

    const getStatusBadge = (status: string) => {
        const badges = {
            PENDING: { label: '⏳ En attente', color: 'bg-yellow-100 text-yellow-800' },
            COMPLETED: { label: '✅ Complétée', color: 'bg-green-100 text-green-800' },
            CANCELLED: { label: '❌ Annulée', color: 'bg-red-100 text-red-800' },
            REFUNDED: { label: '↩️ Remboursée', color: 'bg-purple-100 text-purple-800' }
        }
        const badge = badges[status as keyof typeof badges]
        return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>
    }

    const getPaymentMethodLabel = (method: string) => {
        const labels = {
            CASH: '💵 Espèces',
            CARD: '💳 Carte bancaire',
            MOBILE_MONEY: '📱 Mobile Money',
            CHECK: '📄 Chèque'
        }
        return labels[method as keyof typeof labels] || method
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`${theme.card.base} w-full max-w-4xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto`}>
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-xl z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold">📄 Détails de la vente</h3>
                            <p className="text-blue-100 text-sm mt-1">N° {sale.saleNumber}</p>
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
                <div className="px-6 py-6 space-y-6">
                    {/* Informations générales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <div className="text-sm text-slate-600 mb-1">Statut</div>
                            {getStatusBadge(sale.status)}
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <div className="text-sm text-slate-600 mb-1">Date & Heure</div>
                            <div className="text-sm font-semibold text-slate-800">
                                {new Date(sale.createdAt).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                            <div className="text-xs text-slate-500">
                                {new Date(sale.createdAt).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <div className="text-sm text-slate-600 mb-1">Méthode de paiement</div>
                            <div className="text-sm font-semibold text-slate-800">
                                {getPaymentMethodLabel(sale.paymentMethod)}
                            </div>
                        </div>
                    </div>

                    {/* Magasin et Vendeur */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-xs text-blue-700 font-medium">Magasin</div>
                                    <div className="text-sm font-semibold text-blue-900">{sale.store.name}</div>
                                    <div className="text-xs text-blue-600">{sale.store.city}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                    {sale.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-xs text-green-700 font-medium">Vendeur</div>
                                    <div className="text-sm font-semibold text-green-900">{sale.user.name}</div>
                                    <div className="text-xs text-green-600">{sale.user.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Articles */}
                    <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-3">📦 Articles vendus ({sale.items.length})</h4>
                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700">Produit</th>
                                        <th className="text-center py-3 px-4 text-xs font-semibold text-slate-700">Quantité</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700">Prix unitaire</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700">Sous-total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {sale.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="py-3 px-4">
                                                <div className="text-sm font-medium text-slate-800">{item.product.name}</div>
                                                <div className="text-xs text-slate-500">SKU: {item.product.sku}</div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {item.quantity} {item.product.unit}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right text-sm text-slate-600">
                                                {item.unitPrice.toLocaleString()} GNF
                                            </td>
                                            <td className="py-3 px-4 text-right text-sm font-semibold text-slate-800">
                                                {item.subtotal.toLocaleString()} GNF
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Résumé financier */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4">💰 Résumé financier</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Sous-total</span>
                                <span className="font-semibold text-slate-800">{sale.subtotal.toLocaleString()} GNF</span>
                            </div>
                            {sale.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Remise</span>
                                    <span className="font-semibold text-red-600">- {sale.discount.toLocaleString()} GNF</span>
                                </div>
                            )}
                            {sale.tax > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Taxe</span>
                                    <span className="font-semibold text-slate-800">+ {sale.tax.toLocaleString()} GNF</span>
                                </div>
                            )}
                            <div className="border-t border-slate-300 pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-bold text-slate-800">TOTAL</span>
                                    <span className="text-2xl font-bold text-green-600">{sale.total.toLocaleString()} GNF</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                                <span className="text-slate-600">Montant payé</span>
                                <span className="font-semibold text-slate-800">{sale.amountPaid.toLocaleString()} GNF</span>
                            </div>
                            {sale.change > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Monnaie rendue</span>
                                    <span className="font-semibold text-blue-600">{sale.change.toLocaleString()} GNF</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    {sale.notes && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <div>
                                    <div className="text-xs font-semibold text-amber-800 mb-1">Notes</div>
                                    <div className="text-sm text-amber-700">{sale.notes}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className={`${theme.button.base} ${theme.button.secondary}`}
                    >
                        Fermer
                    </button>
                    <button
                        onClick={() => window.print()}
                        className={`${theme.button.base} ${theme.button.primary}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Imprimer
                    </button>
                </div>
            </div>
        </div>
    )
}