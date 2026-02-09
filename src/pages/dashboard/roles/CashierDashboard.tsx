import { useEffect, useState } from 'react'
import { theme } from '../../../theme/theme'
import { dashboardService } from '../../../services/dashboard.service'
import { StatCard } from '../../../components/ui/StatCard'

interface User {
    id: string
    name: string
    role: string
    storeId: string
    store: {
        id: string
        name: string
    }
}

export function CashierDashboard({ user }: { user: User }) {
    const [data, setData] = useState<any>(null)
    const [cashRegisterData, setCashRegisterData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        fetchData()
        // Mise à jour de l'heure toutes les secondes
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [overviewRes, cashRegRes] = await Promise.all([
                dashboardService.getOverview(user.storeId),
                dashboardService.getCashRegisterDashboard(user.storeId)
            ])

            if (overviewRes.success) setData(overviewRes.data)
            if (cashRegRes.success) {
                setCashRegisterData(cashRegRes.data)
            }
        } catch (error) {
            console.error('Erreur:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] px-4">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-600">Chargement...</p>
                </div>
            </div>
        )
    }

    if (!data) return null

    // Trouver la caisse de ce caissier
    const myCashRegister = cashRegisterData?.openRegisters.find((r: any) => r.user.id === user.id)

    return (
        <div className="space-y-4 sm:space-y-6 w-full overflow-hidden">
            {/* En-tête avec horloge */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                    <div className="max-w-full">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 break-words">Bonjour {user.name} 👋</h2>
                        <p className="text-indigo-100 text-sm sm:text-base">Point de vente - {user.store.name}</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono">
                            {currentTime.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}
                        </div>
                        <div className="text-indigo-100 mt-1 text-xs sm:text-sm">
                            {currentTime.toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* État de la caisse */}
            {myCashRegister ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 sm:mb-6">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-xs sm:text-sm font-bold rounded-full">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    CAISSE OUVERTE
                                </span>
                                <span className="text-xs sm:text-sm text-slate-600">
                                    Depuis {new Date(myCashRegister.openedAt).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Ma Caisse</h3>
                        </div>
                        <button className={`${theme.button.base} ${theme.button.danger} w-full sm:w-auto px-4 py-2`}>
                            Fermer la caisse
                        </button>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                            <p className="text-xs sm:text-sm text-slate-600 mb-1">Fond de caisse</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 truncate">{myCashRegister.openingAmount.toLocaleString()} GNF</p>
                        </div>
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                            <p className="text-xs sm:text-sm text-slate-600 mb-1">Ventes réalisées</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-600">{myCashRegister.currentSalesCount}</p>
                        </div>
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                            <p className="text-xs sm:text-sm text-slate-600 mb-1">Total encaissé</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 truncate">{myCashRegister.currentRevenue.toLocaleString()} GNF</p>
                        </div>
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                            <p className="text-xs sm:text-sm text-slate-600 mb-1">Espèces attendues</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 truncate">{myCashRegister.expectedCash.toLocaleString()} GNF</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center w-full">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Aucune caisse ouverte</h3>
                    <p className="text-slate-600 text-sm sm:text-base mb-4 sm:mb-6">Ouvrez une caisse pour commencer à enregistrer des ventes</p>
                    <button className={`${theme.button.base} ${theme.button.primary} text-sm sm:text-lg px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto`}>
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        Ouvrir une caisse
                    </button>
                </div>
            )}

            {/* Statistiques du jour */}
            <div className="w-full">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Performance du magasin aujourd'hui
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                    <StatCard
                        title="Ventes du jour"
                        value={data.sales.todaySales}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        }
                        color="purple"
                        subtitle="transactions"
                    />
                    <StatCard
                        title="CA estimé du jour"
                        value={`${Math.round(data.financial.totalRevenue / 30).toLocaleString()} GNF`}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        color="green"
                    />
                    <StatCard
                        title="Caisses actives"
                        value={cashRegisterData.openRegisters.length}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        }
                        color="blue"
                    />
                </div>
            </div>

            {/* Actions principales */}
            <div className={`${theme.card.base} w-full`}>
                <div className={theme.card.header}>
                    Actions Rapides
                </div>
                <div className={theme.card.body}>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                        <button
                            disabled={!myCashRegister}
                            className={`${theme.button.base} ${myCashRegister ? theme.button.primary : theme.button.secondary} py-4 sm:py-6 text-sm sm:text-lg justify-center disabled:opacity-50 disabled:cursor-not-allowed w-full`}
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nouvelle Vente
                        </button>
                        <button className={`${theme.button.base} ${theme.button.secondary} py-4 sm:py-6 text-sm sm:text-lg justify-center w-full`}>
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Rechercher Produit
                        </button>
                    </div>
                </div>
            </div>

            {/* Dernières ventes du magasin */}
            <div className={`${theme.card.base} w-full overflow-hidden`}>
                <div className={theme.card.header}>
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                        <span className="text-sm sm:text-base">📋 Dernières Ventes du Magasin</span>
                        <span className="text-xs text-slate-500">Toutes caisses confondues</span>
                    </div>
                </div>
                <div className={theme.card.body}>
                    {data.recentSales.length === 0 ? (
                        <div className="text-center py-6 sm:py-8">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-slate-500 text-sm sm:text-base">Aucune vente enregistrée</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                            {data.recentSales.slice(0, 10).map((sale: any) => (
                                <div key={sale.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition border border-slate-100">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${sale.user.id === user.id ? 'bg-indigo-100' : 'bg-slate-100'
                                            }`}>
                                            {sale.user.id === user.id ? (
                                                <span className="text-indigo-600 font-bold text-xs sm:text-sm">MOI</span>
                                            ) : (
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-mono text-xs sm:text-sm font-semibold text-slate-900 truncate">{sale.saleNumber}</p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {sale.user.name} • {new Date(sale.createdAt).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 pl-2">
                                        <p className="font-bold text-slate-900 text-sm sm:text-base truncate">{sale.total.toLocaleString()} GNF</p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${sale.paymentMethod === 'CASH' ? 'bg-green-100 text-green-700' :
                                            sale.paymentMethod === 'CARD' ? 'bg-blue-100 text-blue-700' :
                                                sale.paymentMethod === 'MOBILE_MONEY' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-slate-100 text-slate-700'
                                            }`}>
                                            {sale.paymentMethod}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Aide rapide */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg sm:rounded-xl p-4 sm:p-6 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-shrink-0">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-2">Besoin d'aide ?</h4>
                        <ul className="space-y-1 text-xs sm:text-sm text-slate-600">
                            <li>• <strong>F1</strong> : Ouvrir l'aide</li>
                            <li>• <strong>F2</strong> : Nouvelle vente</li>
                            <li>• <strong>F3</strong> : Rechercher un produit</li>
                            <li>• <strong>F4</strong> : Dernières transactions</li>
                        </ul>
                        <button className="mt-3 text-xs sm:text-sm text-cyan-600 hover:text-cyan-800 font-medium">
                            Voir le guide complet →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}