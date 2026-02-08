import { theme } from '../../theme/theme'

interface StockMovementDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    movement: {
        id: string
        type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT'
        quantity: number
        reference?: string
        notes?: string
        createdAt: string
        product: {
            id: string
            name: string
            sku: string
            barcode?: string
            unit: string
        }
        store: {
            id: string
            name: string
            city: string
            address?: string
        }
        user: {
            id: string
            name: string
            email: string
        }
        fromStoreId?: string
        toStoreId?: string
    }
}

export function StockMovementDetailsModal({ isOpen, onClose, movement }: StockMovementDetailsModalProps) {
    if (!isOpen) return null

    const getTypeConfig = (type: string) => {
        const configs = {
            IN: { label: 'Entrée de Stock', color: 'bg-green-100 text-green-700 border-green-300', icon: '📥' },
            OUT: { label: 'Sortie de Stock', color: 'bg-red-100 text-red-700 border-red-300', icon: '📤' },
            TRANSFER: { label: 'Transfert Inter-Magasins', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: '🔄' },
            ADJUSTMENT: { label: 'Ajustement d\'Inventaire', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: '⚖️' }
        }
        return configs[type as keyof typeof configs]
    }

    const typeConfig = getTypeConfig(movement.type)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`${theme.card.base} w-full max-w-3xl mx-4 shadow-2xl`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl border-2 ${typeConfig.color} flex items-center justify-center text-2xl`}>
                                {typeConfig.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-slate-800">{typeConfig.label}</h3>
                                <p className="text-sm text-slate-500">Détails du mouvement</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-6">
                    {/* Type de mouvement */}
                    <div className={`p-4 rounded-lg border-2 ${typeConfig.color}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold">Type de mouvement</p>
                                <p className="text-lg font-bold mt-1">{typeConfig.label}</p>
                            </div>
                            <div className="text-4xl">{typeConfig.icon}</div>
                        </div>
                    </div>

                    {/* Produit */}
                    <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">📦 Produit</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Nom :</span>
                                <span className="text-sm font-medium text-slate-900">{movement.product.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600">SKU :</span>
                                <span className="text-sm font-medium text-slate-900">{movement.product.sku}</span>
                            </div>
                            {movement.product.barcode && (
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Code-barres :</span>
                                    <span className="text-sm font-medium text-slate-900">{movement.product.barcode}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quantité */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <div className="text-center">
                            <p className="text-sm text-indigo-700 mb-1">Quantité</p>
                            <p className="text-4xl font-bold text-indigo-900">
                                {movement.type === 'OUT' ? '-' : '+'}{movement.quantity}
                            </p>
                            <p className="text-sm text-indigo-600 mt-1">{movement.product.unit}</p>
                        </div>
                    </div>

                    {/* Magasin(s) */}
                    {movement.type === 'TRANSFER' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-red-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-red-700 mb-3">🏪 Magasin source</h4>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-slate-900">{movement.store.name}</p>
                                    <p className="text-xs text-slate-600">{movement.store.city}</p>
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-green-700 mb-3">🏪 Magasin destination</h4>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-slate-900">Magasin de destination</p>
                                    <p className="text-xs text-slate-600">Ville</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-slate-700 mb-3">🏪 Magasin</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Nom :</span>
                                    <span className="text-sm font-medium text-slate-900">{movement.store.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-600">Ville :</span>
                                    <span className="text-sm font-medium text-slate-900">{movement.store.city}</span>
                                </div>
                                {movement.store.address && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600">Adresse :</span>
                                        <span className="text-sm font-medium text-slate-900 text-right">{movement.store.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Informations complémentaires */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Référence */}
                        {movement.reference && (
                            <div className="bg-slate-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">📋 Référence</h4>
                                <p className="text-sm font-medium text-slate-900">{movement.reference}</p>
                            </div>
                        )}

                        {/* Date */}
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">📅 Date</h4>
                            <p className="text-sm font-medium text-slate-900">
                                {new Date(movement.createdAt).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Utilisateur */}
                    <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">👤 Effectué par</h4>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {movement.user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">{movement.user.name}</p>
                                <p className="text-xs text-slate-600">{movement.user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {movement.notes && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-amber-800 mb-2">📝 Notes</h4>
                            <p className="text-sm text-amber-900">{movement.notes}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end rounded-b-xl">
                    <button
                        onClick={onClose}
                        className={`${theme.button.base} ${theme.button.secondary}`}
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    )
}