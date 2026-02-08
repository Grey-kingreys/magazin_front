import { theme } from '../../theme/theme'

interface DeleteConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    itemName?: string
    loading?: boolean
}

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    itemName,
    loading = false
}: DeleteConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`${theme.card.base} w-full max-w-md mx-4 shadow-2xl`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    <p className="text-slate-600 mb-4">{message}</p>
                    {itemName && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-800">
                                <span className="font-semibold">Élément à supprimer :</span> {itemName}
                            </p>
                        </div>
                    )}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800">
                            <span className="font-semibold">⚠️ Attention :</span> Cette action est irréversible.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-xl">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className={`${theme.button.base} ${theme.button.secondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`${theme.button.base} ${theme.button.danger} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Suppression...
                            </span>
                        ) : (
                            'Confirmer la suppression'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}