import { DeleteConfirmModal } from '../modals/DeleteConfirmModal'

interface DeleteStoreModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    store: { name: string; city?: string }
    loading?: boolean
}

export function DeleteStoreModal({ isOpen, onClose, onConfirm, store, loading = false }: DeleteStoreModalProps) {
    return (
        <DeleteConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Supprimer le magasin"
            message={`Êtes-vous sûr de vouloir supprimer définitivement le magasin "${store.name}" ${store.city ? `(${store.city})` : ''} ?`}
            itemName={store.name}
            loading={loading}
        />
    )
}