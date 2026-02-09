import { theme } from '../../theme/theme'

interface ExpenseDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    expense: {
        id: string
        store: {
            name: string
            city: string
        }
        user: {
            name: string
            email: string
        }
        category: string
        description: string
        amount: number
        reference: string | null
        paymentMethod: string | null
        date: string
        createdAt: string
    }
}

export function ExpenseDetailsModal({ isOpen, onClose, expense }: ExpenseDetailsModalProps) {
    if (!isOpen) return null

    const getPaymentMethodLabel = (method: string | null) => {
        const methods: Record<string, string> = {
            'CASH': 'Espèces',
            'CARD': 'Carte bancaire',
            'MOBILE_MONEY': 'Mobile Money',
            'CHECK': 'Chèque'
        }
        return method ? methods[method] || method : '—'
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`${theme.card.base} w-full max-w-2xl mx-4 shadow-2xl`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800">Détails de la Dépense</h3>
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
                    {/* Montant principal */}
                    <div className="text-center py-6 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-sm text-red-600 mb-2">Montant de la dépense</p>
                        <p className="text-4xl font-bold text-red-700">
                            {expense.amount.toLocaleString('fr-FR')} GNF
                        </p>
                    </div>

                    {/* Informations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Magasin</h5>
                            <p className="text-sm text-slate-800">{expense.store.name}</p>
                            <p className="text-xs text-slate-500">{expense.store.city}</p>
                        </div>

                        <div>
                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Catégorie</h5>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {expense.category}
                            </span>
                        </div>

                        <div>
                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Date</h5>
                            <p className="text-sm text-slate-800">
                                {new Date(expense.date).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>

                        <div>
                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Moyen de paiement</h5>
                            <p className="text-sm text-slate-800">
                                {getPaymentMethodLabel(expense.paymentMethod)}
                            </p>
                        </div>

                        {expense.reference && (
                            <div>
                                <h5 className="text-sm font-semibold text-slate-700 mb-2">Référence</h5>
                                <p className="text-sm text-slate-800">{expense.reference}</p>
                            </div>
                        )}

                        <div>
                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Créé par</h5>
                            <p className="text-sm text-slate-800">{expense.user.name}</p>
                            <p className="text-xs text-slate-500">{expense.user.email}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h5 className="text-sm font-semibold text-slate-700 mb-2">Description</h5>
                        <p className="text-sm text-slate-800 bg-slate-50 p-4 rounded-lg">
                            {expense.description}
                        </p>
                    </div>

                    {/* Métadonnées */}
                    <div className="pt-4 border-t border-slate-200">
                        <p className="text-xs text-slate-500">
                            Créée le {new Date(expense.createdAt).toLocaleString('fr-FR')}
                        </p>
                    </div>
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