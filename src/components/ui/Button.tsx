import { theme } from '../../theme/theme'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger'
    children: React.ReactNode
}

export function Button({
    variant = 'primary',
    children,
    className = '',
    ...props
}: ButtonProps) {
    const variantClass = theme.button[variant]

    return (
        <button
            className={`${theme.button.base} ${variantClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}