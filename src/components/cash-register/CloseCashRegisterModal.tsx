import { useState } from 'react'
import { cashRegisterService } from '../../services/cash-register.service'

interface CashRegister {
    id: string
    store: {
        name: string
    }
    openingAmount: number
}

interface CloseCashRegisterModalProps {
    cashRegister: CashRegister
    onClose: () => void
    onSuccess: () => void
}

export function CloseCashRegisterModal({ cashRegister, onClose, onSuccess }: CloseCashRegisterModalProps) {
    const [formData, setFormData] = useState({
        closingAmount: '',
        notes: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (error) setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.closingAmount || parseFloat(formData.closingAmount) < 0) {
            setError('Le montant de fermeture doit être positif')
            return
        }

        setLoading(true)

        try {
            const response = await cashRegisterService.closeCashRegister(cashRegister.id, {
                closingAmount: parseFloat(formData.closingAmount),
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
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-2xl">
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
                        <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            ⚠️ {error}
                        </div>
                    )}

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

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Montant de fermeture (GNF) *
                        </label>
                        <input
                            type="number"
                            name="closingAmount"
                            value={formData.closingAmount}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="850000"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Montant réel compté dans la caisse
                        </p>
                    </div>

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
                            placeholder="Remarques sur la fermeture..."
                        />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800">
                            <span className="font-semibold">⚠️ Attention :</span> Une fois fermée, la caisse ne pourra plus être modifiée.
                        </p>
                    </div>

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
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'Fermeture...' : 'Fermer la Caisse'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}