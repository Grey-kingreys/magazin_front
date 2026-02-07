import { useState, useEffect } from 'react'
import { userService } from '../../services/api.service'

interface CreateUserModalProps {
    onClose: () => void
    onSuccess: () => void
}

interface Store {
    id: string
    name: string
    city: string
}

export function CreateUserModal({ onClose, onSuccess }: CreateUserModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER',
        storeId: ''
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
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (data.success) {
                setStores(data.data)
            }
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user types
        if (error) setError('')
    }

    const validateForm = () => {
        // Validation du nom
        if (!formData.name || formData.name.trim().length < 3) {
            setError('Le nom doit contenir au moins 3 caractères')
            return false
        }

        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.name)) {
            setError('Le nom ne doit contenir que des lettres, espaces, apostrophes et tirets')
            return false
        }

        // Validation de l'email
        if (!formData.email || !formData.email.trim()) {
            setError("L'email est obligatoire")
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError("L'email n'est pas valide")
            return false
        }

        // Validation du mot de passe
        if (!formData.password || formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères')
            return false
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            setError('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre')
            return false
        }

        // Validation de la confirmation
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return false
        }

        // Validation du magasin pour certains rôles
        if ((formData.role === 'STORE_MANAGER' || formData.role === 'CASHIER') && !formData.storeId) {
            setError('Un magasin doit être sélectionné pour ce rôle')
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) return

        setLoading(true)

        // Construire le payload proprement
        const payload: any = {
            name: formData.name.trim(),
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
            role: formData.role
        }

        // Ajouter storeId seulement si nécessaire
        if (formData.role === 'STORE_MANAGER' || formData.role === 'CASHIER') {
            if (formData.storeId) {
                payload.storeId = formData.storeId
            }
        }

        console.log('📤 Payload envoyé:', payload)

        try {
            const response = await userService.createUser(payload)
            console.log('📥 Réponse reçue:', response)

            if (response.success) {
                alert(response.message)
                onSuccess()
                onClose()
            } else {
                setError(response.message || 'Erreur lors de la création')
            }
        } catch (err: any) {
            console.error('❌ Erreur complète:', err)
            setError(err.message || 'Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    const showStoreSelect = formData.role === 'STORE_MANAGER' || formData.role === 'CASHIER'

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Nouvel Utilisateur</h2>
                                <p className="text-blue-100 text-sm">Créer un nouveau compte utilisateur</p>
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

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nom complet *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Jean Dupont"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Lettres, espaces, apostrophes et tirets uniquement
                        </p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Adresse email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="jean@example.com"
                        />
                    </div>

                    {/* Rôle */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Rôle *
                        </label>
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
                        <p className="text-xs text-slate-500 mt-1">
                            Détermine les permissions et l'accès aux fonctionnalités
                        </p>
                    </div>

                    {/* Magasin (conditionnel) */}
                    {showStoreSelect && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Magasin assigné *
                            </label>
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
                            <p className="text-xs text-slate-500 mt-1">
                                Obligatoire pour les gérants et caissiers
                            </p>
                        </div>
                    )}

                    {/* Mot de passe */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Mot de passe *
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="••••••••"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
                        </p>
                    </div>

                    {/* Confirmer mot de passe */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Confirmer le mot de passe *
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

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
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Création...
                                </span>
                            ) : (
                                'Créer l\'utilisateur'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}