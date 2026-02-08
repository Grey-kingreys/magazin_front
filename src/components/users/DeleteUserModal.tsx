import { DeleteConfirmModal } from '../modals/DeleteConfirmModal'

interface DeleteUserModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    user: { name: string; email: string }
    loading?: boolean
}

export function DeleteUserModal({ isOpen, onClose, onConfirm, user, loading = false }: DeleteUserModalProps) {
    return (
        <DeleteConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Supprimer l'utilisateur"
            message={`Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur "${user.name}" (${user.email}) ?`}
            itemName={user.name}
            loading={loading}
        />
    )
}