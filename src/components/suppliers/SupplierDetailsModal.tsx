import { theme } from '../../theme/theme'

interface Supplier {
    id: string
    name: string
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    country: string | null
    taxId: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string
    _count: {
        products: number
    }
}

interface SupplierDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    supplier: Supplier
}

export function SupplierDetailsModal({ isOpen, onClose, supplier }: SupplierDetailsModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`${theme.card.base} w-full max-w-2xl mx-4 shadow-2xl`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800">Détails du fournisseur</h3>
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
                <div className="px-6 py-6 space-y-6">
                    {/* Nom et statut */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                                {supplier.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-slate-800">{supplier.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {supplier.isActive ? 'Actif' : 'Inactif'}
                                </span>
                                <span className="text-sm text-slate-500">
                                    {supplier._count.products} produit{supplier._count.products > 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Informations de contact */}
                    <div>
                        <h5 className="text-sm font-semibold text-slate-700 mb-3">Contact</h5>
                        <div className="space-y-2">
                            {supplier.email && (
                                <div className="flex items-center gap-3 text-sm">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-slate-600">{supplier.email}</span>
                                </div>
                            )}
                            {supplier.phone && (
                                <div className="flex items-center gap-3 text-sm">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-slate-600">{supplier.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Localisation */}
                    {(supplier.address || supplier.city || supplier.country) && (
                        <div>
                            <h5 className="text-sm font-semibold text-slate-700 mb-3">Localisation</h5>
                            <div className="space-y-2">
                                {supplier.address && (
                                    <div className="flex items-start gap-3 text-sm">
                                        <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-slate-600">{supplier.address}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-slate-600">
                                        {[supplier.city, supplier.country].filter(Boolean).join(', ') || '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Informations fiscales */}
                    {supplier.taxId && (
                        <div>
                            <h5 className="text-sm font-semibold text-slate-700 mb-3">Informations fiscales</h5>
                            <div className="flex items-center gap-3 text-sm">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-slate-600">NIF: {supplier.taxId}</span>
                            </div>
                        </div>
                    )}

                    {/* Dates */}
                    <div className="pt-4 border-t border-slate-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">Créé le</span>
                                <div className="font-medium text-slate-800">
                                    {new Date(supplier.createdAt).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-500">Modifié le</span>
                                <div className="font-medium text-slate-800">
                                    {new Date(supplier.updatedAt).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end rounded-b-xl">
                    <button
                        onClick={onClose}
                        className={`${theme.button.base} ${theme.button.secondary}`}
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    )
}