import { useState, useEffect } from 'react'
import { storeService } from '../../services/store.service'
import { Badge } from '../ui/Badge'

interface StoreDetailsModalProps {
    store: any
    onClose: () => void
}

export function StoreDetailsModal({ store, onClose }: StoreDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'users' | 'stocks'>('info')
    const [users, setUsers] = useState<any[]>([])
    const [stocks, setStocks] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers()
        } else if (activeTab === 'stocks') {
            loadStocks()
        }
    }, [activeTab])

    const loadUsers = async () => {
        setLoading(true)
        const response = await storeService.getStoreUsers(store.id)
        if (response.success) {
            setUsers(response.data.users)
        }
        setLoading(false)
    }

    const loadStocks = async () => {
        setLoading(true)
        const response = await storeService.getStoreStocks(store.id)
        if (response.success) {
            setStocks(response.data.stocks)
        }
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">{store.name}</h2>
                            <p className="text-blue-100">📍 {store.city || 'Non spécifié'}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Onglets */}
                <div className="border-b border-slate-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-6 py-3 font-medium transition ${activeTab === 'info'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            ℹ️ Informations
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-3 font-medium transition ${activeTab === 'users'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            👥 Utilisateurs ({store._count.users})
                        </button>
                        <button
                            onClick={() => setActiveTab('stocks')}
                            className={`px-6 py-3 font-medium transition ${activeTab === 'stocks'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            📦 Stocks ({store._count.stocks})
                        </button>
                    </div>
                </div>

                {/* Contenu */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            {/* Statut */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">Statut</h3>
                                <Badge variant={store.isActive ? 'success' : 'danger'}>
                                    {store.isActive ? '✅ Actif' : '❌ Inactif'}
                                </Badge>
                            </div>

                            {/* Coordonnées */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-3">Coordonnées</h3>
                                <div className="space-y-2">
                                    {store.email && (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-slate-700">{store.email}</span>
                                        </div>
                                    )}
                                    {store.phone && (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-slate-700">{store.phone}</span>
                                        </div>
                                    )}
                                    {store.address && (
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-slate-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-slate-700 flex-1">{store.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Statistiques */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-3">Statistiques</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-blue-600">{store._count.users}</p>
                                        <p className="text-sm text-slate-600">Utilisateurs</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-green-600">{store._count.stocks}</p>
                                        <p className="text-sm text-slate-600">Stocks</p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-purple-600">{store._count.sales}</p>
                                        <p className="text-sm text-slate-600">Ventes</p>
                                    </div>
                                </div>
                            </div>

                            {/* Date de création */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">Créé le</h3>
                                <p className="text-slate-600">
                                    {new Date(store.createdAt).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                                </div>
                            ) : users.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-slate-600">Aucun utilisateur assigné à ce magasin</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {users.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-slate-900">{user.name}</p>
                                                <p className="text-sm text-slate-600">{user.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={user.role === 'STORE_MANAGER' ? 'info' : 'success'}>
                                                    {user.role}
                                                </Badge>
                                                <Badge variant={user.isActive ? 'success' : 'danger'}>
                                                    {user.isActive ? 'Actif' : 'Inactif'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'stocks' && (
                        <div>
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                                </div>
                            ) : stocks.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-slate-600">Aucun stock dans ce magasin</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {stocks.map((stock) => (
                                        <div key={stock.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">{stock.product.name}</p>
                                                <p className="text-sm text-slate-600">{stock.product.category.name} • SKU: {stock.product.sku}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-slate-900">{stock.quantity} {stock.product.unit}</p>
                                                {stock.quantity <= stock.product.minStock && (
                                                    <Badge variant="warning">Stock faible</Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}