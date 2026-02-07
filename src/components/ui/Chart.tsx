import { theme } from '../../theme/theme'

interface ChartProps {
    title: string
    type: 'line' | 'bar' | 'pie' | 'donut'
    data: any[]
    height?: number
}

export function Chart({ title, type, data, height = 300 }: ChartProps) {
    // Calculs pour les graphiques
    const maxValue = Math.max(...data.map(d => d.value || 0))

    if (type === 'bar') {
        return (
            <div className={theme.card.base}>
                <div className={theme.card.header}>{title}</div>
                <div className={theme.card.body}>
                    <div className="space-y-3">
                        {data.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                    <span className="text-sm font-bold text-slate-900">{item.value.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full bg-gradient-to-r ${theme.brand.primary}`}
                                        style={{ width: `${(item.value / maxValue) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (type === 'donut' || type === 'pie') {
        const total = data.reduce((sum, item) => sum + item.value, 0)
        const colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-orange-500 to-orange-600',
            'from-red-500 to-red-600',
            'from-cyan-500 to-cyan-600'
        ]

        return (
            <div className={theme.card.base}>
                <div className={theme.card.header}>{title}</div>
                <div className={theme.card.body}>
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative" style={{ width: 200, height: 200 }}>
                            <svg viewBox="0 0 200 200" className="transform -rotate-90">
                                {(() => {
                                    let currentAngle = 0
                                    return data.map((item, index) => {
                                        const percentage = (item.value / total) * 100
                                        const angle = (percentage / 100) * 360
                                        const x1 = 100 + 90 * Math.cos((currentAngle * Math.PI) / 180)
                                        const y1 = 100 + 90 * Math.sin((currentAngle * Math.PI) / 180)
                                        const x2 = 100 + 90 * Math.cos(((currentAngle + angle) * Math.PI) / 180)
                                        const y2 = 100 + 90 * Math.sin(((currentAngle + angle) * Math.PI) / 180)
                                        const largeArc = angle > 180 ? 1 : 0

                                        const path = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`
                                        currentAngle += angle

                                        return (
                                            <path
                                                key={index}
                                                d={path}
                                                className={`fill-gradient-to-br ${colors[index % colors.length]}`}
                                                fill={`hsl(${index * 60}, 70%, 60%)`}
                                                stroke="white"
                                                strokeWidth="2"
                                            />
                                        )
                                    })
                                })()}
                                {type === 'donut' && (
                                    <circle cx="100" cy="100" r="60" fill="white" />
                                )}
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {data.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                                    ></div>
                                    <span className="text-sm text-slate-700">{item.label}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900">{item.value.toLocaleString()}</div>
                                    <div className="text-xs text-slate-500">
                                        {((item.value / total) * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Line chart simple
    return (
        <div className={theme.card.base}>
            <div className={theme.card.header}>{title}</div>
            <div className={theme.card.body}>
                <div style={{ height }} className="relative">
                    <svg width="100%" height="100%" className="overflow-visible">
                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((y) => (
                            <line
                                key={y}
                                x1="0"
                                y1={`${y}%`}
                                x2="100%"
                                y2={`${y}%`}
                                stroke="#e2e8f0"
                                strokeWidth="1"
                            />
                        ))}

                        {/* Line chart */}
                        <polyline
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            points={data.map((item, index) => {
                                const x = (index / (data.length - 1)) * 100
                                const y = 100 - ((item.value / maxValue) * 100)
                                return `${x}%,${y}%`
                            }).join(' ')}
                        />

                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>

                        {/* Data points */}
                        {data.map((item, index) => {
                            const x = (index / (data.length - 1)) * 100
                            const y = 100 - ((item.value / maxValue) * 100)
                            return (
                                <circle
                                    key={index}
                                    cx={`${x}%`}
                                    cy={`${y}%`}
                                    r="4"
                                    fill="#6366f1"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            )
                        })}
                    </svg>
                </div>

                {/* Labels */}
                <div className="flex justify-between mt-4 text-xs text-slate-600">
                    {data.map((item, index) => (
                        <span key={index}>{item.label}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}