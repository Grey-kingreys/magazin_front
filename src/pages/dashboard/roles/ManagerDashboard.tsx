import { useEffect, useState } from 'react'
import { theme } from '../../../theme/theme'
import { dashboardService } from '../../../services/dashboard.service'
import { StatCard } from '../../../components/ui/StatCard'
import { Chart } from '../../../components/ui/Chart'

interface PerformanceData {
    current: any
    previous: any
    changes: {
        revenue: number
        netProfit: number
        sales: number
        averageSale: number
    }
}

export function ManagerDashboard() {
    const [overviewData, setOverviewData] = useState<any>(null)
    const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('30')

    useEffect(() => {
        fetchData()
    }, [period])

    const fetchData = async () => {
        setLoading(true)
        try {
            const endDate = new Date()
            const startDate = new Date()
            startDate.setDate(startDate.getDate() - parseInt(period))

            const [overviewRes, performanceRes] = await Promise.all([
                dashboardService.getOverview(undefined, startDate.toISOString(), endDate.toISOString()),
                dashboardService.getPerformanceComparison(undefined, startDate.toISOString(), endDate.toISOString())
            ])

            if (overviewRes.success) setOverviewData(overviewRes.data)
            if (performanceRes.success) setPerformanceData(performanceRes.data)
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
                    <p className="text-slate-600">Chargement des données...</p>
                </div>
            </div>
        )
    }

    if (!overviewData || !performanceData) return null

    const { current, changes } = performanceData

    return (
        <div className="space-y-4 md:space-y-6 w-full overflow-hidden">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="max-w-full">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">Tableau de bord Direction</h2>
                    <p className="text-slate-600 mt-1 text-sm sm:text-base">Vue consolidée et analyse de performance</p>
                </div>
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="px-3 py-2 sm:px-4 sm:py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base w-full xs:w-auto"
                    >
                        <option value="7">7 derniers jours</option>
                        <option value="30">30 derniers jours</option>
                        <option value="90">90 derniers jours</option>
                    </select>
                    <button
                        onClick={fetchData}
                        className={`${theme.button.base} ${theme.button.secondary} px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base whitespace-nowrap`}
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Actualiser
                    </button>
                </div>
            </div>

            {/* KPIs avec comparaison période précédente */}
            <div className="w-full">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Indicateurs Clés de Performance
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    <StatCard
                        title="Chiffre d'Affaires"
                        value={`${current.financial.totalRevenue.toLocaleString()} GNF`}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                        trend={{
                            value: changes.revenue,
                            isPositive: changes.revenue > 0
                        }}
                        color="blue"
                        sparkline={overviewData.salesTrend.map((s: any) => s.totalAmount)}
                    />
                    <StatCard
                        title="Bénéfice Net"
                        value={`${current.financial.netProfit.toLocaleString()} GNF`}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        trend={{
                            value: changes.netProfit,
                            isPositive: changes.netProfit > 0
                        }}
                        color="green"
                        subtitle={`Marge: ${current.financial.profitMargin.toFixed(1)}%`}
                    />
                    <StatCard
                        title="Nombre de Ventes"
                        value={current.sales.totalSales}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        }
                        trend={{
                            value: changes.sales,
                            isPositive: changes.sales > 0
                        }}
                        color="purple"
                        sparkline={overviewData.salesTrend.map((s: any) => s.salesCount)}
                    />
                    <StatCard
                        title="Panier Moyen"
                        value={`${current.sales.averageSaleAmount.toLocaleString()} GNF`}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        }
                        trend={{
                            value: changes.averageSale,
                            isPositive: changes.averageSale > 0
                        }}
                        color="cyan"
                    />
                </div>
            </div>

            {/* Comparaison Période Actuelle vs Précédente */}
            <div className={`${theme.card.base} w-full`}>
                <div className={theme.card.header}>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Comparaison de Performance
                    </div>
                </div>
                <div className={theme.card.body}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        {/* Période actuelle */}
                        <div className="w-full">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h4 className="text-xs sm:text-sm font-semibold text-slate-700">Période Actuelle</h4>
                                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                                    Actuelle
                                </span>
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <span className="text-xs sm:text-sm text-slate-700">CA Total</span>
                                    <span className="font-semibold text-slate-900 text-sm sm:text-base truncate pl-2">{current.financial.totalRevenue.toLocaleString()} GNF</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <span className="text-xs sm:text-sm text-slate-700">Bénéfice Net</span>
                                    <span className="font-semibold text-slate-900 text-sm sm:text-base truncate pl-2">{current.financial.netProfit.toLocaleString()} GNF</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                    <span className="text-xs sm:text-sm text-slate-700">Nombre de ventes</span>
                                    <span className="font-semibold text-slate-900 text-sm sm:text-base truncate pl-2">{current.sales.totalSales}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                                    <span className="text-xs sm:text-sm text-slate-700">Panier moyen</span>
                                    <span className="font-semibold text-slate-900 text-sm sm:text-base truncate pl-2">{current.sales.averageSaleAmount.toLocaleString()} GNF</span>
                                </div>
                            </div>
                        </div>

                        {/* Période précédente */}
                        <div className="w-full">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h4 className="text-xs sm:text-sm font-semibold text-slate-700">Période Précédente</h4>
                                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                    Référence
                                </span>
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-xs sm:text-sm text-slate-600">CA Total</span>
                                    <div className="text-right min-w-0">
                                        <span className="font-semibold text-slate-700 text-sm sm:text-base truncate block">{performanceData.previous.financial.totalRevenue.toLocaleString()} GNF</span>
                                        <div className={`text-xs font-medium mt-0.5 ${changes.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {changes.revenue >= 0 ? '↗' : '↘'} {Math.abs(changes.revenue).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-xs sm:text-sm text-slate-600">Bénéfice Net</span>
                                    <div className="text-right min-w-0">
                                        <span className="font-semibold text-slate-700 text-sm sm:text-base truncate block">{performanceData.previous.financial.netProfit.toLocaleString()} GNF</span>
                                        <div className={`text-xs font-medium mt-0.5 ${changes.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {changes.netProfit >= 0 ? '↗' : '↘'} {Math.abs(changes.netProfit).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-xs sm:text-sm text-slate-600">Nombre de ventes</span>
                                    <div className="text-right min-w-0">
                                        <span className="font-semibold text-slate-700 text-sm sm:text-base truncate block">{performanceData.previous.sales.totalSales}</span>
                                        <div className={`text-xs font-medium mt-0.5 ${changes.sales >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {changes.sales >= 0 ? '↗' : '↘'} {Math.abs(changes.sales).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-xs sm:text-sm text-slate-600">Panier moyen</span>
                                    <div className="text-right min-w-0">
                                        <span className="font-semibold text-slate-700 text-sm sm:text-base truncate block">{performanceData.previous.sales.averageSaleAmount.toLocaleString()} GNF</span>
                                        <div className={`text-xs font-medium mt-0.5 ${changes.averageSale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {changes.averageSale >= 0 ? '↗' : '↘'} {Math.abs(changes.averageSale).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analyses par magasin */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Chart
                    title="Classement des Magasins par CA"
                    type="bar"
                    data={overviewData.salesByStore.map((s: any) => ({
                        label: s.store.name,
                        value: s.totalRevenue
                    }))}
                />

                <div className={`${theme.card.base} w-full overflow-hidden`}>
                    <div className={theme.card.header}>Détails par Magasin</div>
                    <div className={theme.card.body}>
                        <div className="space-y-2 sm:space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {overviewData.salesByStore.map((store: any, index: number) => (
                                <div key={store.store.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-indigo-300 transition">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                        <span className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-slate-100 text-slate-700' :
                                                'bg-slate-50 text-slate-600'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="font-medium text-slate-800 text-sm sm:text-base truncate">{store.store.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{store.store.city}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 pl-2">
                                        <p className="font-bold text-slate-900 text-sm sm:text-base truncate">{store.totalRevenue.toLocaleString()} GNF</p>
                                        <p className="text-xs text-slate-500">{store.salesCount} ventes</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tendance et Top produits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                    <Chart
                        title="Évolution du Chiffre d'Affaires"
                        type="line"
                        data={overviewData.salesTrend.map((t: any) => ({
                            label: new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
                            value: t.totalAmount
                        }))}
                        height={300}
                    />
                </div>

                <div className={`${theme.card.base} w-full overflow-hidden`}>
                    <div className={theme.card.header}>🏆 Top 5 Produits</div>
                    <div className={theme.card.body}>
                        <div className="space-y-2 sm:space-y-3">
                            {overviewData.topProducts.slice(0, 5).map((item: any, index: number) => (
                                <div key={item.product.id} className="flex items-start gap-2 sm:gap-3">
                                    <span className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-slate-100 text-slate-700'
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 text-sm sm:text-base truncate">{item.product.name}</p>
                                        <p className="text-xs text-slate-500">{item.quantitySold} unités</p>
                                        <p className="text-xs font-semibold text-indigo-600 mt-1 truncate">
                                            {item.totalRevenue.toLocaleString()} GNF
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}