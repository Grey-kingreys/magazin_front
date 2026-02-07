import { useState, useEffect } from 'react'
import { theme } from '../../theme/theme'
import { authService } from '../../services/api.service'
import { PublicLayout } from '../../components/layout/PublicLayout'

export function ResetPassword() {
    const getTokenFromUrl = () => {
        const params = new URLSearchParams(window.location.search)
        return params.get('token')
    }

    const token = getTokenFromUrl()

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [tokenValid, setTokenValid] = useState<boolean | null>(null)
    const [passwordReset, setPasswordReset] = useState(false)

    useEffect(() => {
        if (token) {
            verifyToken()
        } else {
            setTokenValid(false)
        }
    }, [token])

    const verifyToken = async () => {
        try {
            const data = await authService.verifyResetToken(token!)
            setTokenValid(data.success)

            if (!data.success) {
                setError('Token invalide ou expiré')
            }
        } catch (err) {
            console.error(err)
            setTokenValid(false)
            setError('Erreur de vérification du token')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setMessage('')

        if (newPassword.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères')
            return
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            setError('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return
        }

        setLoading(true)

        try {
            const data = await authService.resetPassword(token!, newPassword)

            if (data.success) {
                setPasswordReset(true)
                setMessage(data.message)

                setTimeout(() => {
                    window.location.href = '/login'
                }, 3000)
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

    if (tokenValid === null) {
        return (
            <PublicLayout showFooter={false}>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-slate-600">Vérification du lien...</p>
                    </div>
                </div>
            </PublicLayout>
        )
    }

    if (tokenValid === false) {
        return (
            <PublicLayout>
                <div className="flex items-center justify-center py-12 px-4">
                    <div className="w-full max-w-md">
                        <div className={theme.card.base}>
                            <div className={theme.card.body}>
                                <div className="text-center py-4">
                                    <div className="mb-4">
                                        <svg
                                            className="w-16 h-16 text-red-500 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-4">
                                        Lien invalide ou expiré
                                    </h2>
                                    <p className="text-slate-600 mb-6">
                                        Ce lien de réinitialisation n'est plus valide. Les liens expirent après 1 heure pour des raisons de sécurité.
                                    </p>
                                    <a
                                        href="/forgot-password"
                                        className={`inline-block ${theme.button.base} ${theme.button.primary} px-6 mb-3`}
                                    >
                                        Faire une nouvelle demande
                                    </a>
                                    <div>
                                        <a
                                            href="/login"
                                            className="text-sm text-indigo-600 hover:text-indigo-800 transition"
                                        >
                                            Retour à la connexion
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        )
    }

    return (
        <PublicLayout>
            <div className="flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
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
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Nouveau mot de passe
                        </h1>
                        <p className="text-slate-600">
                            Choisissez un mot de passe sécurisé
                        </p>
                    </div>

                    <div className={theme.card.base}>
                        <div className={theme.card.body}>
                            {passwordReset ? (
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
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                        Mot de passe réinitialisé ! 🎉
                                    </h3>
                                    <p className="text-slate-600 mb-4">
                                        {message}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Redirection vers la page de connexion...
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label
                                            htmlFor="newPassword"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Nouveau mot de passe
                                        </label>
                                        <input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength={8}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                            placeholder="••••••••"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">
                                            Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Confirmer le mot de passe
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                            placeholder="••••••••"
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
                                                Réinitialisation...
                                            </span>
                                        ) : (
                                            'Réinitialiser le mot de passe'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {!passwordReset && (
                        <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                            <h4 className="text-sm font-semibold text-amber-800 mb-2">
                                🔒 Conseils pour un mot de passe sécurisé :
                            </h4>
                            <ul className="text-xs text-amber-700 space-y-1">
                                <li>• Au moins 8 caractères</li>
                                <li>• Mélange de majuscules et minuscules</li>
                                <li>• Au moins un chiffre</li>
                                <li>• Évitez les mots du dictionnaire</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    )
}