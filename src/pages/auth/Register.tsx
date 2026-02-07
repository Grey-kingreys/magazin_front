import { useState } from 'react'
import { theme } from '../../theme/theme'
import { authService } from '../../services/api.service'

export function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const validateForm = () => {
        if (formData.name.length < 3) {
            setError('Le nom doit contenir au moins 3 caractères')
            return false
        }

        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.name)) {
            setError('Le nom ne doit contenir que des lettres')
            return false
        }

        if (formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères')
            return false
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            setError('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre')
            return false
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const data = await authService.register(
                formData.name,
                formData.email,
                formData.password
            )

            if (data.success) {
                // Stocker le token
                localStorage.setItem('access_token', data.data.access_token)
                // Rediriger vers le dashboard
                window.location.href = '/dashboard'
            } else {
                setError(data.message || 'Erreur lors de l\'inscription')
            }
        } catch (err) {
            setError('Erreur de connexion au serveur')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`min-h-screen flex items-center justify-center ${theme.background.page}`}>
            <div className="w-full max-w-md px-6 py-8">
                {/* Logo / Titre */}
                <div className="text-center mb-8">
                    <div className={`inline-block bg-gradient-to-r ${theme.brand.primary} p-4 rounded-2xl mb-4`}>
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Créer un compte
                    </h1>
                    <p className="text-slate-600">
                        Rejoignez notre plateforme de gestion de stock
                    </p>
                </div>

                {/* Formulaire d'inscription */}
                <div className={theme.card.base}>
                    <div className={theme.card.body}>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Message d'erreur */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Nom complet */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-slate-700 mb-2"
                                >
                                    Nom complet
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="Jean Dupont"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-slate-700 mb-2"
                                >
                                    Adresse email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="jean@example.com"
                                />
                            </div>

                            {/* Mot de passe */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700 mb-2"
                                >
                                    Mot de passe
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
                                </p>
                            </div>

                            {/* Confirmer mot de passe */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-slate-700 mb-2"
                                >
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Conditions d'utilisation */}
                            <div className="flex items-start">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    required
                                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                                />
                                <label
                                    htmlFor="terms"
                                    className="ml-2 text-sm text-slate-600"
                                >
                                    J'accepte les{' '}
                                    <a href="#" className="text-indigo-600 hover:text-indigo-800">
                                        conditions d'utilisation
                                    </a>{' '}
                                    et la{' '}
                                    <a href="#" className="text-indigo-600 hover:text-indigo-800">
                                        politique de confidentialité
                                    </a>
                                </label>
                            </div>

                            {/* Bouton d'inscription */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full ${theme.button.base} ${theme.button.primary} py-3 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Inscription...
                                    </span>
                                ) : (
                                    'Créer mon compte'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Lien vers connexion */}
                <div className="text-center mt-6">
                    <p className="text-sm text-slate-600">
                        Vous avez déjà un compte ?{' '}
                        <a
                            href="/login"
                            className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                        >
                            Se connecter
                        </a>
                    </p>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <span className="font-semibold">✨ Bienvenue !</span> Votre compte sera créé avec le rôle USER. Un email de bienvenue vous sera envoyé.
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-slate-600 mt-6">
                    © 2024 Gestion de Stock. Tous droits réservés.
                </p>
            </div>
        </div>
    )
}