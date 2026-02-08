import { useState, useEffect } from 'react'
import { theme } from '../../theme/theme'
import { categoryService } from '../../services/category.service'

interface Category {
    id: string
    name: string
    description: string | null
}

interface CategoryFormProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    onError: (message: string) => void
    category?: Category | null
}

export function CategoryForm({ isOpen, onClose, onSuccess, onError, category }: CategoryFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description || ''
            })
        } else {
            setFormData({
                name: '',
                description: ''
            })
        }
        setErrors({})
    }, [category, isOpen])

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est obligatoire'
        } else if (formData.name.length < 2) {
            newErrors.name = 'Le nom doit contenir au moins 2 caractères'
        } else if (formData.name.length > 100) {
            newErrors.name = 'Le nom ne peut pas dépasser 100 caractères'
        } else if (!/^[a-zA-Z0-9À-ÿ\s\-'&(),.]+$/.test(formData.name)) {
            newErrors.name = 'Le nom contient des caractères non autorisés'
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'La description ne peut pas dépasser 500 caractères'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const data = {
                name: formData.name.trim(),
                description: formData.description.trim() || undefined
            }

            let response
            if (category) {
                response = await categoryService.updateCategory(category.id, data)
            } else {
                response = await categoryService.createCategory(data)
            }

            if (response.success) {
                onSuccess()
                onClose()
            } else {
                onError(response.message || 'Une erreur est survenue')
            }
        } catch (error) {
            console.error('Erreur:', error)
            onError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`${theme.card.base} w-full max-w-2xl mx-4 shadow-2xl`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800">
                            {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                        </h3>
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
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-6 space-y-6">
                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nom de la catégorie <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                    }`}
                                placeholder="Ex: Électronique, Vêtements, Alimentation..."
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                            <p className="mt-1 text-xs text-slate-500">
                                {formData.name.length}/100 caractères
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                    }`}
                                placeholder="Description détaillée de la catégorie (optionnel)..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                            <p className="mt-1 text-xs text-slate-500">
                                {formData.description.length}/500 caractères
                            </p>
                        </div>

                        {/* Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-1">💡 Conseils :</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Utilisez des noms clairs et descriptifs</li>
                                        <li>• Évitez les caractères spéciaux</li>
                                        <li>• La description aide à mieux organiser vos produits</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-xl">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className={`${theme.button.base} ${theme.button.secondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`${theme.button.base} ${theme.button.primary} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {category ? 'Modification...' : 'Création...'}
                                </span>
                            ) : (
                                category ? 'Modifier' : 'Créer'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}