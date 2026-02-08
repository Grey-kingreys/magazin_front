import { useState } from 'react'
import { saleService } from '../../services/sale.service'

interface ChangeSaleStatusModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    sale: {
        id: string
        saleNumber: string
        status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
        total: number
    }
}

export function ChangeSaleStatusModal({ isOpen, onClose, onSuccess, sale }: ChangeSaleStatusModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'>(sale.status)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const statuses = [
        {
            value: 'PENDING',
            label: 'En attente',
            icon: '⏳',
            color: 'yellow',
            description: 'Vente en cours de traitement'
        },
        {
            value: 'COMPLETED',
            label: 'Complétée',
            icon: '✅',
            color: 'green',
            description: 'Vente finalisée avec succès'
        },
        {
            value: 'CANCELLED',
            label: 'Annulée',
            icon: '❌',
            color: 'red',
            description: 'Vente annulée, stock restauré'
        },
        {
            value: 'REFUNDED',
            label: 'Remboursée',
            icon: '↩️',
            color: 'purple',
            description: 'Client remboursé, stock restauré'
        }
    ]

    const getStatusWarning = (newStatus: string) => {
        if (newStatus === 'CANCELLED' && sale.status !== 'PENDING') {
            return '⚠️ Vous ne pouvez annuler que les ventes en attente'
        }
        if (newStatus === 'REFUNDED' && sale.status !== 'COMPLETED') {
            return '⚠️ Vous ne pouvez rembourser que les ventes complétées'
        }
        if ((newStatus === 'CANCELLED' || newStatus === 'REFUNDED') && (sale.status === 'CANCELLED' || sale.status === 'REFUNDED')) {
            return '⚠️ Cette vente a déjà été annulée ou remboursée'
        }
        return null
    }

    const handleSubmit = async () => {
        setError('')

        if (selectedStatus === sale.status) {
            setError('Le statut sélectionné est identique au statut actuel')
            return
        }

        const warning = getStatusWarning(selectedStatus)
        if (warning) {
            setError(warning)
            return
        }

        const confirmMessage = selectedStatus === 'CANCELLED'
            ? `⚠️ Voulez-vous vraiment ANNULER cette vente ?\n\nN° ${sale.saleNumber}\nMontant: ${sale.total.toLocaleString()} GNF\n\nLe stock sera automatiquement restauré.`
            : selectedStatus === 'REFUNDED'
                ? `⚠️ Voulez-vous vraiment REMBOURSER cette vente ?\n\nN° ${sale.saleNumber}\nMontant: ${sale.total.toLocaleString()} GNF\n\nLe stock sera automatiquement restauré.`
                : `Confirmer le changement de statut vers "${statuses.find(s => s.value === selectedStatus)?.label}" ?`

        const confirmed = window.confirm(confirmMessage)
        if (!confirmed) return

        setLoading(true)

        try {
            const response = await saleService.updateSaleStatus(sale.id, selectedStatus)

            if (response.success) {
                alert(`✅ ${response.message}`)
                onSuccess()
                onClose()
            } else {
                setError(response.message)
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors du changement de statut')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold">🔄 Changer le statut</h3>
                            <p className="text-purple-100 text-sm mt-1">Vente N° {sale.saleNumber}</p>
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
                <div className="px-6 py-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Statut actuel */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-2">Statut actuel</div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{statuses.find(s => s.value === sale.status)?.icon}</span>
                            <span className="text-lg font-semibold text-slate-800">
                                {statuses.find(s => s.value === sale.status)?.label}
                            </span>
                        </div>
                    </div>

                    {/* Sélection nouveau statut */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Nouveau statut *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {statuses.map((status) => (
                                <button
                                    key={status.value}
                                    type="button"
                                    onClick={() => setSelectedStatus(status.value as any)}
                                    className={`p-4 rounded-lg border-2 transition text-left ${selectedStatus === status.value
                                            ? `border-${status.color}-500 bg-${status.color}-50`
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{status.icon}</span>
                                        <span className="font-semibold text-slate-800">{status.label}</span>
                                    </div>
                                    <p className="text-xs text-slate-600">{status.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Avertissement pour annulation/remboursement */}
                    {(selectedStatus === 'CANCELLED' || selectedStatus === 'REFUNDED') && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <div className="text-sm font-semibold text-amber-800 mb-1">⚠️ Attention</div>
                                    <ul className="text-xs text-amber-700 space-y-1">
                                        <li>• Cette action est irréversible</li>
                                        <li>• Le stock des produits sera automatiquement restauré</li>
                                        <li>• Un mouvement de stock sera créé pour tracer l'opération</li>
                                        {selectedStatus === 'REFUNDED' && (
                                            <li>• Le montant de {sale.total.toLocaleString()} GNF devra être remboursé au client</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || selectedStatus === sale.status}
                        className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Traitement...
                            </span>
                        ) : (
                            'Confirmer le changement'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}