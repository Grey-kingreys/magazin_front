import { theme } from '../../theme/theme'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={theme.footer.container}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                    {/* À propos */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white">StockPro</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">
                            Solution professionnelle de gestion de stock multi-magasins.
                            Optimisez vos opérations et suivez vos ventes en temps réel.
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs font-medium">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                                Système actif
                            </span>
                        </div>
                    </div>

                    {/* Liens rapides */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-4">Liens rapides</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/dashboard" className={`text-sm ${theme.footer.link}`}>
                                    📊 Tableau de bord
                                </a>
                            </li>
                            <li>
                                <a href="#documentation" className={`text-sm ${theme.footer.link}`}>
                                    📚 Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#aide" className={`text-sm ${theme.footer.link}`}>
                                    ❓ Centre d'aide
                                </a>
                            </li>
                            <li>
                                <a href="#api" className={`text-sm ${theme.footer.link}`}>
                                    🔌 API
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support & Contact */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-4">Support</h3>
                        <ul className="space-y-2 mb-4">
                            <li>
                                <a href="#support" className={`text-sm ${theme.footer.link}`}>
                                    💬 Contact Support
                                </a>
                            </li>
                            <li>
                                <a href="#statut" className={`text-sm ${theme.footer.link}`}>
                                    🟢 État du service
                                </a>
                            </li>
                        </ul>
                        <div className="space-y-2">
                            <a
                                href="mailto:support@stockpro.com"
                                className="text-sm text-indigo-400 hover:text-indigo-300 transition flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                support@stockpro.com
                            </a>
                            <a
                                href="tel:+224622000000"
                                className="text-sm text-indigo-400 hover:text-indigo-300 transition flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                +224 622 00 00 00
                            </a>
                        </div>
                    </div>
                </div>

                {/* Ligne de séparation */}
                <div className="border-t border-slate-800 pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <div className="text-sm text-slate-400">
                            © {currentYear} StockPro. Tous droits réservés.
                        </div>

                        {/* Liens légaux */}
                        <div className="flex items-center gap-6">
                            <a href="#conditions" className={`text-sm ${theme.footer.link}`}>
                                Conditions d'utilisation
                            </a>
                            <a href="#confidentialite" className={`text-sm ${theme.footer.link}`}>
                                Confidentialité
                            </a>
                            <a href="#cookies" className={`text-sm ${theme.footer.link}`}>
                                Cookies
                            </a>
                        </div>

                        {/* Version */}
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>v1.0.0</span>
                            <span>•</span>
                            <span>Build 2024.02</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}