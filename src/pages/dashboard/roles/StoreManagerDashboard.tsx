import { useEffect, useState } from 'react'
import { theme } from '../../../theme/theme'
import { dashboardService } from '../../../services/dashboard.service'
import { StatCard } from '../../../components/ui/StatCard'
import { Chart } from '../../../components/ui/Chart'

interface User {
    id: string
    name: string
    role: string
    storeId: string
    store: {
        id: string
        name: string
        city: string
    }
}

export function StoreManagerDashboard({ user }: { user: User }) {
    const [data, setData] = useState<any>(null)
    const [cashRegisterData, setCashRegisterData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Vérifier que l'utilisateur a un store
        if (!user.storeId || !user.store) {
            setError("Votre compte n'est associé à aucun magasin. Contactez l'administrateur.")
            setLoading(false)
            return
        }

        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            // Récupérer les données pour ce magasin uniquement
            const [overviewRes, cashRegRes] = await Promise.all([
                dashboardService.getOverview(user.storeId),
                dashboardService.getCashRegisterDashboard(user.storeId)
            ])

            if (overviewRes.success) setData(overviewRes.data)
            if (cashRegRes.success) setCashRegisterData(cashRegRes.data)
        } catch (error) {
            console.error('Erreur:', error)
            setError("Erreur lors du chargement des données")
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
                    <p className="text-slate-600">Chargement des données...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12 px-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 max-w-md mx-auto">
                    <p className="font-bold">Erreur</p>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    // Ajoutez aussi une vérification ici
    if (!user.storeId || !user.store) {
        return (
            <div className="text-center py-12 px-4">
                <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-lg mb-4 max-w-md mx-auto">
                    <p className="font-bold">Configuration requise</p>
                    <p>Votre compte n'est associé à aucun magasin. Contactez l'administrateur.</p>
                </div>
            </div>
        )
    }

    if (!data) return null

    return (
        <div className="space-y-4 sm:space-y-6 w-full overflow-hidden">
            {/* En-tête avec info magasin */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-0">
                <div className="max-w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-lg">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="font-bold text-sm sm:text-base truncate max-w-[200px]">{user.store.name}</span>
                            </div>
                        </div>
                        <span className="text-slate-500 text-xs sm:text-base">📍 {user.store.city}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Tableau de bord Magasin</h2>
                    <p className="text-slate-600 mt-1 text-sm sm:text-base">Vue opérationnelle et gestion quotidienne</p>
                </div>
                <button
                    onClick={fetchData}
                    className={`${theme.button.base} ${theme.button.secondary} px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base w-full sm:w-auto`}
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Actualiser
                </button>
            </div>

            {/* KPIs du jour */}
            <div className="w-full">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Aujourd'hui
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
                        title="CA du jour"
                        value={`${Math.round(data.financial.totalRevenue / 30).toLocaleString()} GNF`}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        color="green"
                        subtitle="Estimation"
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
                        subtitle={cashRegisterData.openRegisters.length > 0 ? 'en cours' : 'aucune ouverte'}
                    />
                    <StatCard
                        title="Alertes stock"
                        value={data.stock.lowStockCount}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        }
                        color={data.stock.lowStockCount > 0 ? 'orange' : 'green'}
                    />
                </div>
            </div>

            {/* Performance période */}
            <div className="w-full">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Performance (30 derniers jours)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                    <StatCard
                        title="Chiffre d'Affaires"
                        value={`${data.financial.totalRevenue.toLocaleString()} GNF`}
                        icon={
                            <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                        color="blue"
                        sparkline={data.salesTrend.map((s: any) => s.totalAmount)}
                    />
                    <StatCard
                        title="Nombre de ventes"
                        value={data.sales.totalSales}
                        icon={
                            <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }
                        color="purple"
                        subtitle={`${data.sales.totalItems} articles vendus`}
                    />
                    <StatCard
                        title="Marge brute"
                        value={`${data.financial.profitMargin.toFixed(1)}%`}
                        icon={
                            <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        }
                        color="green"
                        subtitle={`${data.financial.grossProfit.toLocaleString()} GNF`}
                    />
                </div>
            </div>

            {/* Caisses en cours */}
            {cashRegisterData.openRegisters.length > 0 && (
                <div className={`${theme.card.base} w-full overflow-hidden`}>
                    <div className={theme.card.header}>
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                            <span className="flex items-center gap-2 text-sm sm:text-base">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Caisses Actives
                            </span>
                            <span className="text-xs text-slate-500">{cashRegisterData.openRegisters.length} ouverte(s)</span>
                        </div>
                    </div>
                    <div className={theme.card.body}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {cashRegisterData.openRegisters.map((register: any) => (
                                <div key={register.id} className="p-3 sm:p-4 border-2 border-indigo-200 bg-indigo-50 rounded-lg">
                                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{register.user.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                Ouvert à {new Date(register.openedAt).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded flex-shrink-0 ml-2">
                                            ACTIF
                                        </span>
                                    </div>
                                    <div className="space-y-1 sm:space-y-2">
                                        <div className="flex justify-between text-xs sm:text-sm">
                                            <span className="text-slate-600">Fond de caisse:</span>
                                            <span className="font-semibold text-slate-900 truncate pl-2">{register.openingAmount.toLocaleString()} GNF</span>
                                        </div>
                                        <div className="flex justify-between text-xs sm:text-sm">
                                            <span className="text-slate-600">Ventes:</span>
                                            <span className="font-semibold text-indigo-600">{register.currentSalesCount}</span>
                                        </div>
                                        <div className="flex justify-between text-xs sm:text-sm">
                                            <span className="text-slate-600">CA actuel:</span>
                                            <span className="font-bold text-green-600 truncate pl-2">{register.currentRevenue.toLocaleString()} GNF</span>
                                        </div>
                                        <div className="pt-1 sm:pt-2 border-t border-indigo-200">
                                            <div className="flex justify-between text-xs sm:text-sm">
                                                <span className="text-slate-600">Espèces attendues:</span>
                                                <span className="font-bold text-slate-900 truncate pl-2">{register.expectedCash.toLocaleString()} GNF</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Graphiques et analyses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Chart
                    title="Évolution des ventes (30j)"
                    type="line"
                    data={data.salesTrend.map((t: any) => ({
                        label: new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
                        value: t.totalAmount
                    }))}
                />

                <Chart
                    title="Moyens de paiement"
                    type="donut"
                    data={data.salesByPaymentMethod.map((p: any) => ({
                        label: p.paymentMethod,
                        value: p.total
                    }))}
                />
            </div>

            {/* Top produits et Alertes stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Top produits */}
                <div className={`${theme.card.base} w-full overflow-hidden`}>
                    <div className={theme.card.header}>
                        🏆 Meilleures ventes du magasin
                    </div>
                    <div className={theme.card.body}>
                        <div className="space-y-2 sm:space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {data.topProducts.slice(0, 8).map((item: any, index: number) => (
                                <div key={item.product.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                        <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-slate-200 text-slate-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-slate-800 text-xs sm:text-sm truncate">{item.product.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{item.product.category.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 pl-2">
                                        <p className="font-semibold text-slate-900 text-xs sm:text-sm">{item.quantitySold} vendus</p>
                                        <p className="text-xs text-slate-500 truncate">{item.totalRevenue.toLocaleString()} GNF</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alertes stock */}
                <div className={`${theme.card.base} w-full overflow-hidden`}>
                    <div className={theme.card.header}>
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                            <span className="text-sm sm:text-base">⚠️ Produits à réapprovisionner</span>
                            <span className="text-xs font-medium text-orange-600">{data.lowStockProducts.length}</span>
                        </div>
                    </div>
                    <div className={theme.card.body}>
                        {data.lowStockProducts.length === 0 ? (
                            <div className="text-center py-6 sm:py-8">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-slate-600 font-medium text-sm sm:text-base">Stock optimal !</p>
                                <p className="text-xs text-slate-500 mt-1">Tous les produits sont bien approvisionnés</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {data.lowStockProducts.map((item: any) => (
                                    <div key={item.product.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-800 text-xs sm:text-sm truncate">{item.product.name}</p>
                                            <p className="text-xs text-slate-600 mt-0.5 truncate">{item.product.category.name}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0 pl-2">
                                            <p className="text-base sm:text-lg font-bold text-orange-600">{item.currentStock}</p>
                                            <p className="text-xs text-slate-500">Min: {item.minStock}</p>
                                            {item.deficit > 0 && (
                                                <p className="text-xs font-medium text-red-600 mt-1">
                                                    Manque: {item.deficit}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions rapides */}
            <div className={`${theme.card.base} w-full`}>
                <div className={theme.card.header}>Actions Rapides</div>
                <div className={theme.card.body}>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <button className={`${theme.button.base} ${theme.button.primary} py-2 sm:py-3 text-xs sm:text-sm justify-center w-full`}>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nouvelle vente
                        </button>
                        <button className={`${theme.button.base} ${theme.button.secondary} py-2 sm:py-3 text-xs sm:text-sm justify-center w-full`}>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Gérer le stock
                        </button>
                        <button className={`${theme.button.base} ${theme.button.secondary} py-2 sm:py-3 text-xs sm:text-sm justify-center w-full`}>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Ouvrir caisse
                        </button>
                        <button className={`${theme.button.base} ${theme.button.secondary} py-2 sm:py-3 text-xs sm:text-sm justify-center w-full`}>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Rapports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}