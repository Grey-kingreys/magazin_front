import { useState } from 'react'
import { theme } from '../../theme/theme'
import { authService } from '../../services/api.service'
import { PublicLayout } from '../../components/layout/PublicLayout'

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = await authService.login(email, password)

            if (data.success) {
                localStorage.setItem('access_token', data.data.access_token)
                window.location.href = '/dashboard'
            } else {
                setError(data.message || 'Erreur de connexion')
            }
        } catch (err) {
            setError('Erreur de connexion au serveur')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <PublicLayout>
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
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
                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Connexion
                        </h1>
                        <p className="text-slate-600">
                            Accédez à votre espace de gestion
                        </p>
                    </div>

                    {/* Formulaire de connexion */}
                    <div className={theme.card.base}>
                        <div className={theme.card.body}>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Message d'erreur */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-slate-700 mb-2"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        placeholder="votre@email.com"
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
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {/* Mot de passe oublié */}
                                <div className="flex items-center justify-end">
                                    <a
                                        href="/forgot-password"
                                        className="text-sm text-indigo-600 hover:text-indigo-800 transition"
                                    >
                                        Mot de passe oublié ?
                                    </a>
                                </div>

                                {/* Bouton de connexion */}
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
                                            Connexion...
                                        </span>
                                    ) : (
                                        'Se connecter'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Lien vers inscription */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-slate-600">
                            Vous n'avez pas de compte ?{' '}
                            <a
                                href="/register"
                                className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                            >
                                Créer un compte
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}