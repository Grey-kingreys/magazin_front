import { PublicNavbar } from './PublicNavbar'
import { PublicFooter } from './PublicFooter'
import { theme } from '../../theme/theme'

interface PublicLayoutProps {
    children: React.ReactNode
    showNavbar?: boolean
    showFooter?: boolean
}

export function PublicLayout({
    children,
    showNavbar = true,
    showFooter = true
}: PublicLayoutProps) {
    return (
        <div className={`min-h-screen flex flex-col ${theme.background.page}`}>
            {/* Navbar */}
            {showNavbar && <PublicNavbar />}

            {/* Contenu principal */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            {showFooter && <PublicFooter />}
        </div>
    )
}