import { useEffect, useState } from 'react'
import { theme } from '../../../theme/theme'
import { dashboardService } from '../../../services/dashboard.service'
import { StatCard } from '../../../components/ui/StatCard'
import { Chart } from '../../../components/ui/Chart'

interface DashboardData {
    financial: any
    sales: any
    stock: any
    topProducts: any[]
    lowStockProducts: any[]
    recentSales: any[]
    salesByStore: any[]
    salesByPaymentMethod: any[]
    salesTrend: any[]
}

export function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('30') // 7, 30, 90 jours

    useEffect(() => {
        fetchData()
    }, [period])

    const fetchData = async () => {
        setLoading(true)
        try {
            const endDate = new Date()
            const startDate = new Date()
            startDate.setDate(startDate.getDate() - parseInt(period))

            const response = await dashboardService.getOverview(
                undefined,
                startDate.toISOString(),
                endDate.toISOString()
            )

            if (response.success) {
                setData(response.data)
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
                    <p className="text-slate-600">Chargement des données...</p>
                </div>
            </div>
        )
    }

    if (!data) return null

    return (
        <div className="space-y-4 md:space-y-6 w-full overflow-hidden">
            {/* En-tête avec filtres */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="max-w-full">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">Vue d'ensemble - Administration</h2>
                    <p className="text-slate-600 mt-1 text-sm sm:text-base">Tableau de bord consolidé multi-magasins</p>
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

            {/* KPIs Financiers */}
            <div className="w-full">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Performance Financière
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    <StatCard
                        title="Chiffre d'Affaires"
                        value={`${data.financial.totalRevenue.toLocaleString()} GNF`}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                        color="blue"
                        sparkline={data.salesTrend.map(s => s.totalAmount)}
                    />
                    <StatCard
                        title="Bénéfice Brut"
                        value={`${data.financial.grossProfit.toLocaleString()} GNF`}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        color="green"
                        subtitle={`Marge: ${data.financial.profitMargin.toFixed(1)}%`}
                    />
                    <StatCard
                        title="Dépenses"
                        value={`${data.financial.totalExpenses.toLocaleString()} GNF`}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        }
                        color="orange"
                    />
                    <StatCard
                        title="Bénéfice Net"
                        value={`${data.financial.netProfit.toLocaleString()} GNF`}
                        icon={
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        }
                        color={data.financial.netProfit >= 0 ? 'green' : 'red'}
                    />
                </div>
            </div>

            {/* KPIs Ventes & Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Ventes */}
                <div className="w-full">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Activité Commerciale
                    </h3>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                        <StatCard
                            title="Total Ventes"
                            value={data.sales.totalSales}
                            icon={
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            }
                            color="purple"
                            subtitle={`${data.sales.totalItems} articles`}
                        />
                        <StatCard
                            title="Panier Moyen"
                            value={`${data.sales.averageSaleAmount.toLocaleString()} GNF`}
                            icon={
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            }
                            color="cyan"
                        />
                    </div>
                </div>

                {/* Stock */}
                <div className="w-full">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        État des Stocks
                    </h3>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                        <StatCard
                            title="Produits Actifs"
                            value={data.stock.totalProducts}
                            icon={
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            }
                            color="blue"
                        />
                        <StatCard
                            title="Alertes Stock"
                            value={data.stock.lowStockCount}
                            icon={
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            }
                            color="orange"
                        />
                    </div>
                </div>
            </div>

            {/* Graphiques et analyses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Performance par magasin */}
                <Chart
                    title="Chiffre d'Affaires par Magasin"
                    type="bar"
                    data={data.salesByStore.map(s => ({
                        label: s.store.name,
                        value: s.totalRevenue
                    }))}
                />

                {/* Méthodes de paiement */}
                <Chart
                    title="Répartition des Paiements"
                    type="donut"
                    data={data.salesByPaymentMethod.map(p => ({
                        label: p.paymentMethod,
                        value: p.total
                    }))}
                />
            </div>

            {/* Tendance des ventes */}
            <Chart
                title="Évolution du Chiffre d'Affaires"
                type="line"
                data={data.salesTrend.map(t => ({
                    label: new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
                    value: t.totalAmount
                }))}
                height={300}
            />

            {/* Top produits et Alertes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Top Produits */}
                <div className={`${theme.card.base} w-full overflow-hidden`}>
                    <div className={theme.card.header}>
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                            <span className="text-sm sm:text-base">🏆 Top 10 Produits</span>
                            <span className="text-xs text-slate-500">Par quantité vendue</span>
                        </div>
                    </div>
                    <div className={`${theme.card.body} overflow-x-auto`}>
                        <div className="min-w-[280px] space-y-2 sm:space-y-3">
                            {data.topProducts.slice(0, 10).map((item, index) => (
                                <div key={item.product.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                        <span className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-slate-100 text-slate-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-slate-50 text-slate-600'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-slate-800 text-sm sm:text-base truncate">{item.product.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{item.product.category.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 pl-2">
                                        <p className="font-semibold text-slate-900 text-sm sm:text-base">{item.quantitySold} unités</p>
                                        <p className="text-xs text-slate-500">{item.totalRevenue.toLocaleString()} GNF</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alertes Stock */}
                <div className={`${theme.card.base} w-full overflow-hidden`}>
                    <div className={theme.card.header}>
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                            <span className="text-sm sm:text-base">⚠️ Alertes Stock Faible</span>
                            <span className="text-xs text-orange-600 font-medium">{data.lowStockProducts.length} produit(s)</span>
                        </div>
                    </div>
                    <div className={theme.card.body}>
                        {data.lowStockProducts.length === 0 ? (
                            <div className="text-center py-6 sm:py-8">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-slate-600 text-sm sm:text-base">Tous les stocks sont au niveau optimal !</p>
                            </div>
                        ) : (
                            <div className="space-y-2 sm:space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                {data.lowStockProducts.map((item) => (
                                    <div key={`${item.product.id}-${item.store.id}`} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-lg">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-800 text-sm sm:text-base truncate">{item.product.name}</p>
                                            <p className="text-xs text-slate-600 mt-0.5 truncate">
                                                📍 {item.store.name} • {item.product.category.name}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0 pl-2">
                                            <p className="text-lg font-bold text-orange-600">{item.currentStock}</p>
                                            <p className="text-xs text-slate-500">Min: {item.minStock}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ventes récentes */}
            <div className={`${theme.card.base} w-full overflow-hidden`}>
                <div className={theme.card.header}>
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                        <span className="text-sm sm:text-base">📋 Dernières Ventes</span>
                        <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 whitespace-nowrap">Voir tout →</a>
                    </div>
                </div>
                <div className={theme.card.body}>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead className="border-b border-slate-200">
                                <tr>
                                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700">N° Vente</th>
                                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700">Magasin</th>
                                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700">Vendeur</th>
                                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700">Date</th>
                                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700">Paiement</th>
                                    <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700">Montant</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.recentSales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-50 transition">
                                        <td className="py-3 px-2 sm:px-4">
                                            <span className="font-mono text-xs sm:text-sm text-slate-900 truncate block max-w-[100px]">{sale.saleNumber}</span>
                                        </td>
                                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-slate-700 truncate max-w-[120px]">{sale.store.name}</td>
                                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-slate-700 truncate max-w-[100px]">{sale.user.name}</td>
                                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                                            {new Date(sale.createdAt).toLocaleString('fr-FR', {
                                                day: '2-digit',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="py-3 px-2 sm:px-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${sale.paymentMethod === 'CASH' ? 'bg-green-100 text-green-700' :
                                                sale.paymentMethod === 'CARD' ? 'bg-blue-100 text-blue-700' :
                                                    sale.paymentMethod === 'MOBILE_MONEY' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-slate-100 text-slate-700'
                                                }`}>
                                                {sale.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 sm:px-4 text-right">
                                            <span className="font-semibold text-slate-900 text-sm sm:text-base">{sale.total.toLocaleString()} GNF</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}