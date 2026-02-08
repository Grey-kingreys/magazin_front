import { theme } from '../../theme/theme'

interface CategoryDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    category: {
        id: string
        name: string
        description: string | null
        createdAt: string
        _count: { products: number }
    }
}

export function CategoryDetailsModal({ isOpen, onClose, category }: CategoryDetailsModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`${theme.card.base} w-full max-w-2xl mx-4 shadow-2xl`}>
                <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800">Détails de la catégorie</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="px-6 py-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                                {category.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-slate-800">{category.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category._count.products > 0
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}>
                                    {category._count.products} produit{category._count.products > 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    {category.description && (
                        <div>
                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Description</h5>
                            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                {category.description}
                            </p>
                        </div>
                    )}

                    <div className="pt-4 border-t border-slate-200">
                        <h5 className="text-sm font-semibold text-slate-700 mb-3">Informations</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-slate-500">Créée le</span>
                                <div className="text-sm font-medium text-slate-800">
                                    {new Date(category.createdAt).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500">Nombre de produits</span>
                                <div className="text-sm font-medium text-slate-800">
                                    {category._count.products}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end rounded-b-xl">
                    <button onClick={onClose} className={`${theme.button.base} ${theme.button.secondary}`}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    )
}