import { useState, useEffect } from 'react'
import { theme } from '../../theme/theme'
import { supplierService } from '../../services/supplier.service'

interface Supplier {
    id: string
    name: string
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    country: string | null
    taxId: string | null
}

interface SupplierFormProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    onError: (message: string) => void
    supplier?: Supplier | null
}

export function SupplierForm({ isOpen, onClose, onSuccess, onError, supplier }: SupplierFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        taxId: ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name,
                email: supplier.email || '',
                phone: supplier.phone || '',
                address: supplier.address || '',
                city: supplier.city || '',
                country: supplier.country || '',
                taxId: supplier.taxId || ''
            })
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                country: '',
                taxId: ''
            })
        }
        setErrors({})
    }, [supplier, isOpen])

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        // Validation du nom (obligatoire)
        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est obligatoire'
        } else if (formData.name.length < 2) {
            newErrors.name = 'Le nom doit contenir au moins 2 caractères'
        } else if (formData.name.length > 100) {
            newErrors.name = 'Le nom ne peut pas dépasser 100 caractères'
        } else if (!/^[a-zA-Z0-9À-ÿ\s\-'&(),.]+$/.test(formData.name)) {
            newErrors.name = 'Le nom contient des caractères non autorisés'
        }

        // Validation de l'email (optionnel mais format valide si renseigné)
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "L'email n'est pas valide"
        }

        // Validation du téléphone (optionnel mais longueur max si renseigné)
        if (formData.phone && formData.phone.length > 20) {
            newErrors.phone = 'Le téléphone ne peut pas dépasser 20 caractères'
        }

        // Validation de l'adresse
        if (formData.address && formData.address.length > 200) {
            newErrors.address = "L'adresse ne peut pas dépasser 200 caractères"
        }

        // Validation de la ville
        if (formData.city && formData.city.length > 100) {
            newErrors.city = 'La ville ne peut pas dépasser 100 caractères'
        }

        // Validation du pays
        if (formData.country && formData.country.length > 100) {
            newErrors.country = 'Le pays ne peut pas dépasser 100 caractères'
        }

        // Validation du numéro fiscal
        if (formData.taxId && formData.taxId.length > 50) {
            newErrors.taxId = 'Le numéro fiscal ne peut pas dépasser 50 caractères'
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
                email: formData.email.trim() || undefined,
                phone: formData.phone.trim() || undefined,
                address: formData.address.trim() || undefined,
                city: formData.city.trim() || undefined,
                country: formData.country.trim() || undefined,
                taxId: formData.taxId.trim() || undefined
            }

            let response
            if (supplier) {
                response = await supplierService.updateSupplier(supplier.id, data)
            } else {
                response = await supplierService.createSupplier(data)
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
            <div className={`${theme.card.base} w-full max-w-4xl mx-4 shadow-2xl`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800">
                            {supplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
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
                        {/* Informations générales */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Informations générales
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nom */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Nom du fournisseur <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                            }`}
                                        placeholder="Ex: Apple Inc., Samsung Electronics..."
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                    <p className="mt-1 text-xs text-slate-500">
                                        {formData.name.length}/100 caractères
                                    </p>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                            }`}
                                        placeholder="contact@fournisseur.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Téléphone */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Téléphone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                            }`}
                                        placeholder="+224 622 00 00 00"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                    )}
                                    <p className="mt-1 text-xs text-slate-500">
                                        {formData.phone.length}/20 caractères
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Localisation */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Localisation
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Adresse */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Adresse complète
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${errors.address ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                            }`}
                                        placeholder="123 Avenue de la République..."
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                    )}
                                    <p className="mt-1 text-xs text-slate-500">
                                        {formData.address.length}/200 caractères
                                    </p>
                                </div>

                                {/* Ville */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Ville
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${errors.city ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                            }`}
                                        placeholder="Conakry, Paris, New York..."
                                    />
                                    {errors.city && (
                                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                                    )}
                                    <p className="mt-1 text-xs text-slate-500">
                                        {formData.city.length}/100 caractères
                                    </p>
                                </div>

                                {/* Pays */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Pays
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${errors.country ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                            }`}
                                        placeholder="Guinée, France, USA..."
                                    />
                                    {errors.country && (
                                        <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                                    )}
                                    <p className="mt-1 text-xs text-slate-500">
                                        {formData.country.length}/100 caractères
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Informations fiscales */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Informations fiscales
                            </h4>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Numéro fiscal (NIF, SIRET, etc.)
                                </label>
                                <input
                                    type="text"
                                    name="taxId"
                                    value={formData.taxId}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${errors.taxId ? 'border-red-300 bg-red-50' : 'border-slate-300'
                                        }`}
                                    placeholder="NIF123456789, SIRET 123 456 789 00012..."
                                />
                                {errors.taxId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.taxId}</p>
                                )}
                                <p className="mt-1 text-xs text-slate-500">
                                    {formData.taxId.length}/50 caractères
                                </p>
                            </div>
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
                                        <li>• Seul le nom est obligatoire</li>
                                        <li>• Remplissez au maximum les informations pour faciliter la gestion</li>
                                        <li>• Les informations de contact sont utiles pour les commandes</li>
                                        <li>• Le numéro fiscal est important pour la comptabilité</li>
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
                                    {supplier ? 'Modification...' : 'Création...'}
                                </span>
                            ) : (
                                supplier ? 'Modifier' : 'Créer'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}