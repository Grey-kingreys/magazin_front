import { useState } from 'react'
import { cashRegisterService } from '../../services/cash-register.service'

interface CashRegister {
    id: string
    store: {
        name: string
    }
    openingAmount: number
    availableAmount: number // ⭐ Nouveau champ
    stats?: {
        expectedAmount?: number
        cashSalesTotal?: number
    }
}

interface CloseCashRegisterModalProps {
    cashRegister: CashRegister
    onClose: () => void
    onSuccess: () => void
}

export function CloseCashRegisterModal({ cashRegister, onClose, onSuccess }: CloseCashRegisterModalProps) {
    const [formData, setFormData] = useState({
        countedAmount: '',
        notes: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [calculatedInfo, setCalculatedInfo] = useState<{
        expectedAmount: number
        difference: number
    } | null>(null)

    // ⭐ UTILISER availableAmount AU LIEU DE CALCULER
    const expectedAmount = cashRegister.availableAmount

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setFormData(prev => {
            const newData = { ...prev, [name]: value }

            // Si l'utilisateur modifie le montant compté, calculer la différence
            if (name === 'countedAmount' && value) {
                const counted = parseFloat(value)
                if (!isNaN(counted)) {
                    const difference = counted - expectedAmount
                    setCalculatedInfo({
                        expectedAmount,
                        difference
                    })
                } else {
                    setCalculatedInfo(null)
                }
            }

            return newData
        })

        if (error) setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.countedAmount) {
            setError('Veuillez entrer le montant réel compté')
            return
        }

        const countedAmount = parseFloat(formData.countedAmount)
        if (countedAmount < 0) {
            setError('Le montant compté doit être positif')
            return
        }

        setLoading(true)

        try {
            const response = await cashRegisterService.closeCashRegister(cashRegister.id, {
                closingAmount: countedAmount,
                notes: formData.notes || undefined
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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col">
                {/* Header fixe */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-2xl flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Fermer la Caisse</h2>
                                <p className="text-orange-100 text-sm">{cashRegister.store.name}</p>
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

                {/* Contenu avec défilement */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Section Montant d'ouverture */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-900">Montant d'ouverture</span>
                                <span className="text-lg font-bold text-blue-900">
                                    {cashRegister.openingAmount.toLocaleString('fr-FR')} GNF
                                </span>
                            </div>
                            <p className="text-xs text-blue-700">
                                Montant présent dans la caisse au démarrage
                            </p>
                        </div>

                        {/* ⭐ SECTION NOUVELLE: Montant disponible dans la caisse */}
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-indigo-900">Montant disponible actuel</span>
                                <span className="text-lg font-bold text-indigo-900">
                                    {cashRegister.availableAmount.toLocaleString('fr-FR')} GNF
                                </span>
                            </div>
                            <div className="text-xs text-indigo-700 space-y-1">
                                <p>• Ouverture : {cashRegister.openingAmount.toLocaleString('fr-FR')} GNF</p>
                                <p>• + Ventes en espèces : {(cashRegister.availableAmount - cashRegister.openingAmount).toLocaleString('fr-FR')} GNF</p>
                                <p className="font-medium mt-1">Total disponible dans la caisse</p>
                            </div>
                        </div>

                        {/* Section Montant théorique attendu */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-emerald-900">Montant théorique attendu</span>
                                <span className="text-lg font-bold text-emerald-900">
                                    {expectedAmount.toLocaleString('fr-FR')} GNF
                                </span>
                            </div>
                            <div className="text-xs text-emerald-700 space-y-1">
                                <p>• Montant disponible : {cashRegister.availableAmount.toLocaleString('fr-FR')} GNF</p>
                                <p className="font-medium mt-1">C'est ce qui devrait être dans la caisse (basé sur les ventes enregistrées)</p>
                            </div>
                        </div>

                        {/* Champ : Montant réel compté */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Montant réel compté (GNF) *
                            </label>
                            <input
                                type="number"
                                name="countedAmount"
                                value={formData.countedAmount}
                                onChange={handleChange}
                                required
                                min="0"
                                step="1"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Comptez l'argent physique dans la caisse"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Comptez soigneusement l'argent présent physiquement dans la caisse
                            </p>
                        </div>

                        {/* Calcul automatique de la différence */}
                        {calculatedInfo && (
                            <div className={`border rounded-lg p-4 ${calculatedInfo.difference === 0
                                ? 'bg-green-50 border-green-200'
                                : calculatedInfo.difference > 0
                                    ? 'bg-amber-50 border-amber-200'
                                    : 'bg-red-50 border-red-200'
                                }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">
                                        {calculatedInfo.difference === 0
                                            ? '✅ Caisse exacte'
                                            : calculatedInfo.difference > 0
                                                ? '⚠️ Excédent détecté'
                                                : '❌ Manque détecté'
                                        }
                                    </span>
                                    <span className={`text-lg font-bold ${calculatedInfo.difference === 0
                                        ? 'text-green-700'
                                        : calculatedInfo.difference > 0
                                            ? 'text-amber-700'
                                            : 'text-red-700'
                                        }`}>
                                        {calculatedInfo.difference > 0 ? '+' : ''}
                                        {calculatedInfo.difference.toLocaleString('fr-FR')} GNF
                                    </span>
                                </div>
                                <p className="text-xs">
                                    {calculatedInfo.difference === 0
                                        ? 'Le montant compté correspond exactement au montant disponible.'
                                        : calculatedInfo.difference > 0
                                            ? `Il y a ${calculatedInfo.difference.toLocaleString('fr-FR')} GNF de trop dans la caisse.`
                                            : `Il manque ${Math.abs(calculatedInfo.difference).toLocaleString('fr-FR')} GNF dans la caisse.`
                                    }
                                </p>
                            </div>
                        )}

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Notes (optionnel)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Ex: Billets de 10,000 GNF manquants, problème avec la monnaie..."
                            />
                        </div>

                        {/* Avertissement */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Information importante</p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        • Le montant disponible inclut déjà toutes les ventes en espèces<br />
                                        • Seul le montant physique actuel dans la caisse doit être compté<br />
                                        • La différence est calculée entre le montant compté et le montant disponible<br />
                                        • Une fois fermée, la caisse ne pourra plus être modifiée
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Boutons fixés en bas */}
                <div className="border-t p-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.countedAmount}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                            onClick={handleSubmit}
                        >
                            {loading ? 'Fermeture...' : 'Confirmer la Fermeture'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}