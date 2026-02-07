import { theme } from '../../theme/theme'

interface StatCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    trend?: {
        value: number
        isPositive: boolean
    }
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan'
    subtitle?: string
    sparkline?: number[] // Données pour mini graphique
}

export function StatCard({
    title,
    value,
    icon,
    trend,
    color = 'blue',
    subtitle,
    sparkline
}: StatCardProps) {
    const colorClasses = {
        blue: 'from-blue-600 to-indigo-600',
        green: 'from-green-600 to-emerald-600',
        purple: 'from-purple-600 to-violet-600',
        orange: 'from-orange-600 to-amber-600',
        red: 'from-red-600 to-rose-600',
        cyan: 'from-cyan-600 to-blue-600'
    }

    const colorBg = {
        blue: 'bg-blue-50',
        green: 'bg-green-50',
        purple: 'bg-purple-50',
        orange: 'bg-orange-50',
        red: 'bg-red-50',
        cyan: 'bg-cyan-50'
    }

    // Générer les points du sparkline
    const generateSparkline = () => {
        if (!sparkline || sparkline.length === 0) return null

        const max = Math.max(...sparkline)
        const min = Math.min(...sparkline)
        const range = max - min || 1

        const points = sparkline.map((value, index) => {
            const x = (index / (sparkline.length - 1)) * 100
            const y = 100 - ((value - min) / range) * 100
            return `${x},${y}`
        }).join(' ')

        return (
            <svg className="w-full h-8 mt-2" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    points={points}
                    className="opacity-30"
                />
            </svg>
        )
    }

    return (
        <div className={`${theme.card.base} hover:shadow-md transition-shadow duration-200`}>
            <div className={theme.card.body}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
                        <p className="text-3xl font-bold text-slate-900 mb-1">
                            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
                        </p>

                        {subtitle && (
                            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
                        )}

                        {trend && (
                            <div className="flex items-center gap-1 mt-2">
                                {trend.isPositive ? (
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                )}
                                <span className={`text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {Math.abs(trend.value).toFixed(1)}%
                                </span>
                                <span className="text-xs text-slate-500">vs période préc.</span>
                            </div>
                        )}
                    </div>

                    <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl shadow-lg flex-shrink-0`}>
                        <div className="text-white">
                            {icon}
                        </div>
                    </div>
                </div>

                {/* Mini graphique sparkline */}
                {sparkline && sparkline.length > 0 && (
                    <div className={`${colorBg[color]} rounded-lg px-2 py-1 -mb-2 -mx-2 mt-3`}>
                        {generateSparkline()}
                    </div>
                )}
            </div>
        </div>
    )
}