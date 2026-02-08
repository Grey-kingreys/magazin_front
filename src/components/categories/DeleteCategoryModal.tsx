import { DeleteConfirmModal } from '../modals/DeleteConfirmModal'

interface DeleteCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    category: { name: string }
    loading?: boolean
}

export function DeleteCategoryModal({ isOpen, onClose, onConfirm, category, loading = false }: DeleteCategoryModalProps) {
    return (
        <DeleteConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Supprimer la catégorie"
            message={`Êtes-vous sûr de vouloir supprimer définitivement la catégorie "${category.name}" ?`}
            itemName={category.name}
            loading={loading}
        />
    )
}