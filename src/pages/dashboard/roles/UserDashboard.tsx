import { theme } from '../../../theme/theme'

interface User {
    id: string
    name: string
    role: string
    email: string
}

export function UserDashboard({ user }: { user: User }) {
    return (
        <div className="space-y-4 sm:space-y-6 w-full overflow-hidden">
            {/* Message de bienvenue */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl w-full">
                <div className="max-w-3xl">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 break-words">Bienvenue {user.name} ! 👋</h2>
                    <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                        Votre compte utilisateur a été créé avec succès. Vous pouvez mettre à jour vos informations personnelles et consulter l'activité de votre compte.
                    </p>
                </div>
            </div>

            {/* Informations du compte */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className={`${theme.card.base} w-full`}>
                    <div className={theme.card.header}>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Mon Profil
                        </div>
                    </div>
                    <div className={theme.card.body}>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold flex-shrink-0">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-slate-800 text-base sm:text-lg truncate">{user.name}</p>
                                    <p className="text-slate-500 text-xs sm:text-sm truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="pt-3 sm:pt-4 border-t border-slate-200">
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    <span className="text-xs sm:text-sm text-slate-600">Rôle</span>
                                    <span className="px-2 py-1 sm:px-3 sm:py-1 bg-slate-100 text-slate-700 rounded-full text-xs sm:text-sm font-medium">
                                        {user.role}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs sm:text-sm text-slate-600">Statut</span>
                                    <span className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        Actif
                                    </span>
                                </div>
                            </div>

                            <button className={`w-full ${theme.button.base} ${theme.button.primary} text-sm sm:text-base`}>
                                Modifier mon profil
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`${theme.card.base} w-full`}>
                    <div className={theme.card.header}>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Sécurité
                        </div>
                    </div>
                    <div className={theme.card.body}>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-800 text-sm sm:text-base">Mot de passe sécurisé</p>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Votre mot de passe respecte les critères de sécurité</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 sm:gap-3">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-800 text-sm sm:text-base">Email vérifié</p>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1 truncate">{user.email}</p>
                                </div>
                            </div>

                            <button className={`w-full ${theme.button.base} ${theme.button.secondary} mt-3 sm:mt-4 text-sm sm:text-base`}>
                                Changer mon mot de passe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions disponibles */}
            <div className={`${theme.card.base} w-full`}>
                <div className={theme.card.header}>
                    Actions Disponibles
                </div>
                <div className={theme.card.body}>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        <button className={`${theme.button.base} ${theme.button.secondary} py-3 sm:py-4 flex-col text-xs sm:text-sm`}>
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Mon Profil</span>
                        </button>
                        <button className={`${theme.button.base} ${theme.button.secondary} py-3 sm:py-4 flex-col text-xs sm:text-sm`}>
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Paramètres</span>
                        </button>
                        <button className={`${theme.button.base} ${theme.button.secondary} py-3 sm:py-4 flex-col text-xs sm:text-sm`}>
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Aide</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Message d'information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-2">Accès Limité</h4>
                        <p className="text-slate-600 text-xs sm:text-sm mb-3">
                            Votre compte possède un accès basique à la plateforme. Pour accéder à plus de fonctionnalités comme la gestion des ventes, du stock ou des rapports, contactez votre administrateur pour une mise à niveau de votre rôle.
                        </p>
                        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Consultation de votre profil</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Modification de vos informations</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="truncate">Gestion des ventes (nécessite le rôle CASHIER)</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="truncate">Gestion du stock (nécessite le rôle STORE_MANAGER)</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="truncate">Accès aux rapports (nécessite le rôle MANAGER)</span>
                            </div>
                        </div>
                        <button className={`mt-3 sm:mt-4 ${theme.button.base} ${theme.button.primary} text-xs sm:text-sm w-full sm:w-auto`}>
                            Contacter l'administrateur
                        </button>
                    </div>
                </div>
            </div>

            {/* Guide de démarrage */}
            <div className={`${theme.card.base} w-full overflow-hidden`}>
                <div className={theme.card.header}>
                    🚀 Pour bien démarrer
                </div>
                <div className={theme.card.body}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <h5 className="font-semibold text-slate-800 text-sm sm:text-base mb-2 sm:mb-3">Documentation</h5>
                            <ul className="space-y-1 sm:space-y-2">
                                <li>
                                    <a href="#" className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 sm:gap-2 truncate">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Guide utilisateur
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 sm:gap-2 truncate">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Tutoriels vidéo
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 sm:gap-2 truncate">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold text-slate-800 text-sm sm:text-base mb-2 sm:mb-3">Support</h5>
                            <ul className="space-y-1 sm:space-y-2">
                                <li>
                                    <a href="#" className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 sm:gap-2 truncate">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Contacter le support
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 sm:gap-2 truncate">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                        </svg>
                                        Chat en direct
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 sm:gap-2 truncate">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Appeler le support
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}