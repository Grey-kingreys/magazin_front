import { useState, useEffect } from 'react'
import { userService } from '../../services/api.service'
import { storeService } from '../../services/store.service'

interface User {
    id: string
    name: string
    email: string
    role: string
    storeId?: string
    store?: { id: string; name: string }
}

interface EditUserModalProps {
    user: User
    onClose: () => void
    onSuccess: () => void
}

interface Store {
    id: string
    name: string
    city: string
}

export function EditUserModal({ user, onClose, onSuccess }: EditUserModalProps) {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.storeId || ''
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
            const response = await fetch('http://localhost:3000/stores', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.success) setStores(data.data)
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const payload: any = {
            name: formData.name,
            email: formData.email,
            role: formData.role
        }

        if (formData.role === 'STORE_MANAGER' || formData.role === 'CASHIER') {
            if (!formData.storeId) {
                setError('Un magasin doit être sélectionné pour ce rôle')
                setLoading(false)
                return
            }
            payload.storeId = formData.storeId
        } else {
            payload.storeId = null
        }

        try {
            const response = await userService.updateUser(user.id, payload)
            if (response.success) {
                alert(response.message)
                onSuccess()
                onClose()
            } else {
                setError(response.message)
            }
        } catch (err) {
            setError('Erreur de connexion')
        } finally {
            setLoading(false)
        }
    }

    const showStoreSelect = formData.role === 'STORE_MANAGER' || formData.role === 'CASHIER'

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Modifier l'utilisateur</h2>
                            <p className="text-blue-100 text-sm">{user.name}</p>
                        </div>
                        <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nom complet *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rôle *</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="USER">Utilisateur</option>
                            <option value="CASHIER">Caissier</option>
                            <option value="STORE_MANAGER">Gérant de Magasin</option>
                            <option value="MANAGER">Manager</option>
                            <option value="ADMIN">Administrateur</option>
                        </select>
                    </div>

                    {showStoreSelect && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Magasin *</label>
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