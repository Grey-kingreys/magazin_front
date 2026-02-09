import { useState, useEffect } from 'react'
import { expenseService } from '../../services/expense.service'

interface Store {
    id: string
    name: string
    city: string
}

interface Expense {
    id: string
    storeId: string
    category: string
    description: string
    amount: number
    reference: string | null
    paymentMethod: string | null
    date: string
}

interface EditExpenseModalProps {
    expense: Expense
    onClose: () => void
    onSuccess: () => void
}

export function EditExpenseModal({ expense, onClose, onSuccess }: EditExpenseModalProps) {
    const [formData, setFormData] = useState({
        storeId: expense.storeId,
        category: expense.category,
        description: expense.description,
        amount: expense.amount.toString(),
        reference: expense.reference || '',
        paymentMethod: expense.paymentMethod || 'CASH',
        date: new Date(expense.date).toISOString().split('T')[0]
    })
    const [stores, setStores] = useState<Store[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const categories = [
        'Loyer',
        'Salaires',
        'Électricité',
        'Eau',
        'Internet',
        'Téléphone',
        'Fournitures',
        'Transport',
        'Maintenance',
        'Marketing',
        'Assurance',
        'Taxes',
        'Autres'
    ]

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

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Le montant doit être supérieur à 0')
            return
        }

        setLoading(true)

        try {
            const response = await expenseService.updateExpense(expense.id, {
                storeId: formData.storeId,
                category: formData.category,
                description: formData.description.trim(),
                amount: parseFloat(formData.amount),
                reference: formData.reference || undefined,
                paymentMethod: formData.paymentMethod as any,
                date: formData.date
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
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Modifier la Dépense</h2>
                            <p className="text-blue-100 text-sm">Mettre à jour les informations</p>
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
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Magasin *</label>
                        <select
                            name="storeId"
                            value={formData.storeId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Montant (GNF) *</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Référence</label>
                            <input
                                type="text"
                                name="reference"
                                value={formData.reference}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Moyen de paiement</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="CASH">Espèces</option>
                                <option value="CARD">Carte bancaire</option>
                                <option value="MOBILE_MONEY">Mobile Money</option>
                                <option value="CHECK">Chèque</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? 'Modification...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}