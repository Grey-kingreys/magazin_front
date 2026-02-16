import { useState, useEffect } from 'react';
import { reportService } from '../../services/report.service';
import { theme } from '../../theme/theme';

interface Store {
    id: string;
    name: string;
    city: string;
}

export function ReportsManagement() {
    const [stores, setStores] = useState<Store[]>([]);
    const [activeTab, setActiveTab] = useState<'sales' | 'stock' | 'movements' | 'financial'>('sales');
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    // Filtres communs
    const [filterStore, setFilterStore] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

    // Données des rapports
    const [salesReport, setSalesReport] = useState<any>(null);
    const [stockReport, setStockReport] = useState<any>(null);
    const [movementsReport, setMovementsReport] = useState<any>(null);
    const [financialReport, setFinancialReport] = useState<any>(null);

    // Messages
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:3000/store', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setStores(data.data.stores);
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const generateSalesReport = async () => {
        setLoading(true);
        try {
            const response = await reportService.getSalesReport(
                startDate || undefined,
                endDate || undefined,
                filterStore || undefined,
                groupBy
            );

            if (response.success) {
                setSalesReport(response.data);
                showSuccess('Rapport de ventes généré avec succès');
            } else {
                showError(response.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            showError('Erreur lors de la génération du rapport');
        } finally {
            setLoading(false);
        }
    };

    const generateStockReport = async () => {
        setLoading(true);
        try {
            const response = await reportService.getStockReport(
                filterStore || undefined,
                false
            );

            if (response.success) {
                setStockReport(response.data);
                showSuccess('Rapport de stock généré avec succès');
            } else {
                showError(response.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            showError('Erreur lors de la génération du rapport');
        } finally {
            setLoading(false);
        }
    };

    const generateMovementsReport = async () => {
        setLoading(true);
        try {
            const response = await reportService.getStockMovementsReport(
                startDate || undefined,
                endDate || undefined,
                filterStore || undefined
            );

            if (response.success) {
                setMovementsReport(response.data);
                showSuccess('Rapport de mouvements généré avec succès');
            } else {
                showError(response.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            showError('Erreur lors de la génération du rapport');
        } finally {
            setLoading(false);
        }
    };

    const generateFinancialReport = async () => {
        setLoading(true);
        try {
            const response = await reportService.getFinancialReport(
                startDate || undefined,
                endDate || undefined,
                filterStore || undefined
            );

            if (response.success) {
                setFinancialReport(response.data);
                showSuccess('Rapport financier généré avec succès');
            } else {
                showError(response.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            showError('Erreur lors de la génération du rapport');
        } finally {
            setLoading(false);
        }
    };

    const handleExportSales = async () => {
        setExportLoading(true);
        try {
            const blob = await reportService.exportSalesToExcel(
                startDate || undefined,
                endDate || undefined,
                filterStore || undefined
            );

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rapport_ventes_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showSuccess('Export Excel réussi');
        } catch (error) {
            console.error('Erreur:', error);
            showError('Erreur lors de l\'export');
        } finally {
            setExportLoading(false);
        }
    };

    const handleExportStock = async () => {
        setExportLoading(true);
        try {
            const blob = await reportService.exportStockToExcel(
                filterStore || undefined
            );

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rapport_stock_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showSuccess('Export Excel réussi');
        } catch (error) {
            console.error('Erreur:', error);
            showError('Erreur lors de l\'export');
        } finally {
            setExportLoading(false);
        }
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(''), 5000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* En-tête */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Rapports & Statistiques</h2>
                <p className="text-slate-600 mt-1">Génération et export de rapports</p>
            </div>

            {/* Messages */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errorMessage}
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="flex space-x-8">
                    {[
                        { id: 'sales', label: 'Ventes', icon: '📊' },
                        { id: 'stock', label: 'Stock', icon: '📦' },
                        { id: 'movements', label: 'Mouvements', icon: '🔄' },
                        { id: 'financial', label: 'Financier', icon: '💰' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition ${activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Filtres</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Magasin</label>
                        <select
                            value={filterStore}
                            onChange={(e) => setFilterStore(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Tous les magasins</option>
                            {stores.map(store => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                            ))}
                        </select>
                    </div>

                    {activeTab !== 'stock' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Date début</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Date fin</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'sales' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Grouper par</label>
                            <select
                                value={groupBy}
                                onChange={(e) => setGroupBy(e.target.value as any)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="day">Jour</option>
                                <option value="week">Semaine</option>
                                <option value="month">Mois</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <button
                        onClick={() => {
                            if (activeTab === 'sales') generateSalesReport();
                            else if (activeTab === 'stock') generateStockReport();
                            else if (activeTab === 'movements') generateMovementsReport();
                            else if (activeTab === 'financial') generateFinancialReport();
                        }}
                        disabled={loading}
                        className={`${theme.button.base} ${theme.button.primary} disabled:opacity-50`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Génération...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Générer le rapport
                            </>
                        )}
                    </button>

                    {(activeTab === 'sales' || activeTab === 'stock') && (
                        <button
                            onClick={() => {
                                if (activeTab === 'sales') handleExportSales();
                                else if (activeTab === 'stock') handleExportStock();
                            }}
                            disabled={exportLoading}
                            className={`${theme.button.base} ${theme.button.secondary} disabled:opacity-50`}
                        >
                            {exportLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Export...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Exporter Excel
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Contenu des rapports */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                {activeTab === 'sales' && salesReport && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800">Rapport de Ventes</h3>

                        {/* Résumé */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-blue-700">Total ventes</p>
                                <p className="text-2xl font-bold text-blue-900">{salesReport.summary.totalSales}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-green-700">Chiffre d'affaires</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {salesReport.summary.totalRevenue.toLocaleString()} GNF
                                </p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm text-purple-700">Moyenne</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {salesReport.summary.averageSale.toLocaleString()} GNF
                                </p>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4">
                                <p className="text-sm text-orange-700">Remises</p>
                                <p className="text-2xl font-bold text-orange-900">
                                    {salesReport.summary.totalDiscount.toLocaleString()} GNF
                                </p>
                            </div>
                        </div>

                        {/* Tableau des ventes */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Période</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Ventes</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {salesReport.groupedData.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td className="py-3 px-4 text-sm text-slate-900">{item.period}</td>
                                            <td className="py-3 px-4 text-sm text-slate-700">{item.count}</td>
                                            <td className="py-3 px-4 text-sm font-semibold text-green-700">
                                                {item.total.toLocaleString()} GNF
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'stock' && stockReport && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800">Rapport de Stock</h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-blue-700">Produits</p>
                                <p className="text-2xl font-bold text-blue-900">{stockReport.summary.totalProducts}</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <p className="text-sm text-red-700">Stock faible</p>
                                <p className="text-2xl font-bold text-red-900">{stockReport.summary.lowStockCount}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-green-700">Valeur totale</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {stockReport.summary.totalValue.toLocaleString()} GNF
                                </p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm text-purple-700">Profit potentiel</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {stockReport.summary.potentialProfit.toLocaleString()} GNF
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'movements' && movementsReport && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800">Rapport de Mouvements</h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-blue-700">Total mouvements</p>
                                <p className="text-2xl font-bold text-blue-900">{movementsReport.summary.totalMovements}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-green-700">Entrées</p>
                                <p className="text-2xl font-bold text-green-900">{movementsReport.summary.totalIn}</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <p className="text-sm text-red-700">Sorties</p>
                                <p className="text-2xl font-bold text-red-900">{movementsReport.summary.totalOut}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm text-purple-700">Mouvement net</p>
                                <p className="text-2xl font-bold text-purple-900">{movementsReport.summary.netMovement}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'financial' && financialReport && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800">Rapport Financier</h3>

                        <div className="space-y-4">
                            <div className="bg-slate-50 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-700">Chiffre d'affaires</span>
                                    <span className="text-lg font-bold text-slate-900">
                                        {financialReport.incomeStatement.salesRevenue.toLocaleString()} GNF
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-700">Coût des ventes</span>
                                    <span className="text-lg font-bold text-red-700">
                                        -{financialReport.incomeStatement.costOfGoodsSold.toLocaleString()} GNF
                                    </span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-slate-700">Bénéfice brut</span>
                                    <span className="text-lg font-bold text-green-700">
                                        {financialReport.incomeStatement.grossProfit.toLocaleString()} GNF
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-700">Dépenses d'exploitation</span>
                                    <span className="text-lg font-bold text-red-700">
                                        -{financialReport.incomeStatement.operatingExpenses.toLocaleString()} GNF
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-700">Autres recettes</span>
                                    <span className="text-lg font-bold text-green-700">
                                        +{financialReport.incomeStatement.otherRevenues.toLocaleString()} GNF
                                    </span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-bold text-slate-800">Bénéfice net</span>
                                    <span className="text-2xl font-bold text-green-700">
                                        {financialReport.incomeStatement.netProfit.toLocaleString()} GNF
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-slate-600">Marge nette</span>
                                    <span className="text-sm font-semibold text-green-600">
                                        {financialReport.incomeStatement.netMargin}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!salesReport && !stockReport && !movementsReport && !financialReport && (
                    <div className="text-center py-12 text-slate-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p>Aucun rapport généré</p>
                        <p className="text-sm mt-2">Configurez les filtres et cliquez sur "Générer le rapport"</p>
                    </div>
                )}
            </div>
        </div>
    );
}