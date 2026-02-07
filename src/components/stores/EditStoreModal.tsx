import { useState } from 'react'
import { storeService } from '../../services/store.service'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

interface EditStoreModalProps {
    store: any
    onClose: () => void
}

export function EditStoreModal({ store, onClose }: EditStoreModalProps) {
    const [formData, setFormData] = useState({
        name: store.name || '',
        email: store.email || '',
        phone: store.phone || '',
        address: store.address || '',
        city: store.city || ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)

        // Validation
        const newErrors: Record<string, string> = {}
        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est obligatoire'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setLoading(false)
            return
        }

        // Préparer les données
        const dataToSend: any = {
            name: formData.name.trim()
        }
        if (formData.email.trim()) dataToSend.email = formData.email.trim()
        if (formData.phone.trim()) dataToSend.phone = formData.phone.trim()
        if (formData.address.trim()) dataToSend.address = formData.address.trim()
        if (formData.city.trim()) dataToSend.city = formData.city.trim()

        const response = await storeService.updateStore(store.id, dataToSend)

        if (response.success) {
            alert(response.message)
            onClose()
        } else {
            alert(response.message)
        }

        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* En-tête */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">
                            ✏️ Modifier le magasin
                        </h2>
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

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Input
                        label="Nom du magasin *"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={errors.name}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <Input
                            label="Téléphone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Adresse"
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />

                    <Input
                        label="Ville"
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}