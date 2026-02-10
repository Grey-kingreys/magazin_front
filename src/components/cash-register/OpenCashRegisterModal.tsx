import { useState, useEffect } from 'react'
import { cashRegisterService } from '../../services/cash-register.service'

interface Store {
    id: string
    name: string
    city: string
}

interface OpenCashRegisterModalProps {
    onClose: () => void
    onSuccess: () => void
}

export function OpenCashRegisterModal({ onClose, onSuccess }: OpenCashRegisterModalProps) {
    const [formData, setFormData] = useState({
        storeId: '',
        openingAmount: '0',
        notes: ''
    })
    const [stores, setStores] = useState<Store[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchStores()
    }, [])

    const fetchStores = async () => {
        try {
            const token = localStorage.getItem('access_token')
            const response = await fetch('http://localhost:3000/store', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.success) {
                setStores(data.data.stores)
            }
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (error) setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.storeId) {
            setError('Veuillez sélectionner un magasin')
            return
        }

        if (!formData.openingAmount || parseFloat(formData.openingAmount) < 0) {
            setError("Le montant d'ouverture doit être positif")
            return
        }

        setLoading(true)

        try {
            const response = await cashRegisterService.openCashRegister({
                storeId: formData.storeId,
                openingAmount: parseFloat(formData.openingAmount),
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
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Ouvrir une Caisse</h2>
                                <p className="text-green-100 text-sm">Démarrer une nouvelle session</p>
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

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Montant d'ouverture (GNF)
                        </label>
                        <input
                            type="number"
                            name="openingAmount"
                            value={formData.openingAmount}
                            onChange={handleChange}
                            required
                            min="0"
                            step="1"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="0"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Montant en espèces présent dans la caisse au démarrage
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-xs text-blue-700">
                                    <span className="font-medium">Conseil :</span> Démarrez à 0 GNF pour une gestion simplifiée. 
                                    L'argent des ventes en espèces sera automatiquement crédité au magasin.
                                </p>
                            </div>
                        </div>
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
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Informations supplémentaires..."
                        />
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
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'Ouverture...' : 'Ouvrir la Caisse'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}