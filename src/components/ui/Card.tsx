import { theme } from '../../theme/theme'

interface CardProps {
    title?: string
    children: React.ReactNode
    className?: string
}

export function Card({ title, children, className = '' }: CardProps) {
    return (
        <div className={`${theme.card.base} ${className}`}>
            {title && (
                <div className={theme.card.header}>
                    {title}
                </div>
            )}
            <div className={theme.card.body}>
                {children}
            </div>
        </div>
    )
}