import { DeleteConfirmModal } from '../modals/DeleteConfirmModal'

interface DeleteSupplierModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    supplier: { name: string; email?: string | null }
    loading?: boolean
}

export function DeleteSupplierModal({ isOpen, onClose, onConfirm, supplier, loading = false }: DeleteSupplierModalProps) {
    return (
        <DeleteConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Supprimer le fournisseur"
            message={`Êtes-vous sûr de vouloir supprimer définitivement le fournisseur "${supplier.name}" ${supplier.email ? `(${supplier.email})` : ''} ?`}
            itemName={supplier.name}
            loading={loading}
        />
    )
}