import { theme } from '../../theme/theme'

interface BadgeProps {
    variant?: 'success' | 'warning' | 'danger' | 'info'
    children: React.ReactNode
    className?: string
}

export function Badge({
    variant = 'info',
    children,
    className = ''
}: BadgeProps) {
    const variantClass = theme.badge[variant]

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClass} ${className}`}>
            {children}
        </span>
    )
}