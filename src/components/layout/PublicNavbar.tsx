import { theme } from '../../theme/theme'

export function PublicNavbar() {
    return (
        <nav className={`${theme.navbar.container} sticky top-0 z-50`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo et nom */}
                    <div className="flex items-center gap-3">
                        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                            <div className="bg-white/10 p-2 rounded-lg">
                                <svg
                                    className="w-7 h-7 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">
                                Gestion de Stock
                            </span>
                        </a>
                    </div>

                    {/* Navigation centrale - Desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        <a
                            href="#"
                            className="text-sm font-medium text-blue-100 hover:text-white transition"
                        >
                            Fonctionnalités
                        </a>
                        <a
                            href="#"
                            className="text-sm font-medium text-blue-100 hover:text-white transition"
                        >
                            Tarifs
                        </a>
                        <a
                            href="#"
                            className="text-sm font-medium text-blue-100 hover:text-white transition"
                        >
                            Documentation
                        </a>
                        <a
                            href="#"
                            className="text-sm font-medium text-blue-100 hover:text-white transition"
                        >
                            Support
                        </a>
                    </div>

                    {/* Actions - Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href="/login"
                            className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition"
                        >
                            Se connecter
                        </a>
                        <a
                            href="/register"
                            className="px-4 py-2 text-sm font-medium bg-white text-indigo-600 hover:bg-blue-50 rounded-lg transition shadow-sm"
                        >
                            Créer un compte
                        </a>
                    </div>

                    {/* Menu mobile */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="text-white hover:bg-white/10 p-2 rounded-lg transition"
                            aria-label="Menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}