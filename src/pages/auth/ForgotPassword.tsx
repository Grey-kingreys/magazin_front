import { useState } from 'react'
import { theme } from '../../theme/theme'
import { authService } from '../../services/api.service'
import { PublicLayout } from '../../components/layout/PublicLayout'

export function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)

        try {
            const data = await authService.forgotPassword(email)

            if (data.success) {
                setEmailSent(true)
                setMessage(data.message)
            } else {
                setError(data.message || 'Une erreur est survenue')
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
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Mot de passe oublié ?
                        </h1>
                        <p className="text-slate-600">
                            Pas de problème ! Entrez votre email et nous vous enverrons un lien de réinitialisation.
                        </p>
                    </div>

                    {/* Formulaire */}
                    <div className={theme.card.base}>
                        <div className={theme.card.body}>
                            {emailSent ? (
                                // Message de succès
                                <div className="text-center py-4">
                                    <div className="mb-4">
                                        <svg
                                            className="w-16 h-16 text-green-500 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                        Email envoyé ! 📧
                                    </h3>
                                    <p className="text-slate-600 mb-6">
                                        {message}
                                    </p>
                                    <p className="text-sm text-slate-500 mb-4">
                                        Vérifiez votre boîte de réception et vos spams.
                                    </p>
                                    <a
                                        href="/login"
                                        className={`inline-block ${theme.button.base} ${theme.button.primary} px-6`}
                                    >
                                        Retour à la connexion
                                    </a>
                                </div>
                            ) : (
                                // Formulaire de demande
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Adresse email
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
                                                Envoi en cours...
                                            </span>
                                        ) : (
                                            'Envoyer le lien de réinitialisation'
                                        )}
                                    </button>

                                    <div className="text-center">
                                        <a
                                            href="/login"
                                            className="text-sm text-indigo-600 hover:text-indigo-800 transition"
                                        >
                                            ← Retour à la connexion
                                        </a>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {!emailSent && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">💡 Astuce :</span> Le lien de réinitialisation est valable pendant 1 heure.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    )
}