// src/components/profile/EditProfile.tsx
import { useState, useEffect } from 'react'
import { authService } from '../../services/api.service'

interface User {
    id: string
    name: string
    email: string
    role: string
    isActive: boolean
    createdAt: string
}

export function EditProfile() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    })
    const [errors, setErrors] = useState<{ name?: string; email?: string; general?: string }>({})

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const response = await authService.getProfile()
            if (response.success) {
                setUser(response.data)
                setFormData({
                    name: response.data.name,
                    email: response.data.email
                })
            }
        } catch (error) {
            console.error('Erreur:', error)
            setErrors({ general: 'Erreur lors du chargement du profil' })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Effacer l'erreur quand l'utilisateur commence à taper
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const validateForm = () => {
        const newErrors: { name?: string; email?: string } = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis'
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Le nom doit contenir au moins 3 caractères'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'L\'email n\'est pas valide'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setSaving(true)
        try {
            const response = await authService.editProfile(formData)

            if (response.success) {
                // Afficher un message de succès
                alert('Profil mis à jour avec succès !')
                // Retourner à la page profil
                window.location.href = '/profile'
            } else {
                // Afficher l'erreur
                alert(response.message || 'Erreur lors de la mise à jour du profil')

                // Gérer les erreurs spécifiques
                if (response.message?.includes('déjà utilisé')) {
                    setErrors({ email: response.message })
                }
            }
        } catch (error: any) {
            console.error('Erreur:', error)
            alert('Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        window.location.href = '/profile'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-600">Chargement du profil...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Impossible de charger votre profil</p>
                <button
                    onClick={handleCancel}
                    className="mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                >
                    Retour au profil
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* En-tête */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Modifier mon profil</h2>
                <p className="text-slate-600 mt-1">Mettez à jour vos informations personnelles</p>
            </div>

            {/* Card du formulaire */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
                {errors.general && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{errors.general}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Champ Nom */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nom complet *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={saving}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.name
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-slate-300 focus:ring-indigo-500'
                                } ${saving ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                            placeholder="Votre nom complet"
                        />
                        {errors.name && (
                            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Champ Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={saving}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.email
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-slate-300 focus:ring-indigo-500'
                                } ${saving ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                            placeholder="votre@email.com"
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Informations
                        </h4>
                        <p className="text-sm text-slate-600">
                            Rôle : <span className="font-medium">{user.role}</span>
                        </p>
                        <p className="text-sm text-slate-600">
                            Membre depuis : {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enregistrement...
                                </>
                            ) : (
                                'Enregistrer les modifications'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}