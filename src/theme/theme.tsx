// src/theme/theme.tsx

export const theme = {
    /* =========================
     * BRAND COLORS
     * ========================= */
    brand: {
        primary: 'from-blue-600 to-indigo-800',
        secondary: 'from-indigo-600 to-blue-500',
    },

    /* =========================
     * NAVBAR
     * ========================= */
    navbar: {
        container:
            'bg-gradient-to-r from-blue-700 to-indigo-900 text-white shadow-md',
        item:
            'text-sm font-medium text-blue-100 hover:text-white transition',
        active:
            'text-white border-b-2 border-white',
    },

    /* =========================
     * SIDEBAR
     * ========================= */
    sidebar: {
        container:
            'bg-slate-900 text-slate-200',
        item:
            'px-4 py-2 rounded-md hover:bg-slate-800 transition',
        active:
            'bg-indigo-700 text-white',
    },

    /* =========================
     * BUTTONS
     * ========================= */
    button: {
        base:
            'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all focus:outline-none',
        primary:
            'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:opacity-90',
        secondary:
            'bg-slate-100 text-slate-800 hover:bg-slate-200',
        success:
            'bg-green-600 text-white hover:bg-green-700',
        danger:
            'bg-red-600 text-white hover:bg-red-700',
    },

    /* =========================
     * CARDS
     * ========================= */
    card: {
        base:
            'rounded-xl border border-slate-200 bg-white shadow-sm',
        header:
            'px-4 py-3 border-b border-slate-200 font-semibold text-slate-800',
        body:
            'p-4 text-slate-600',
    },

    /* =========================
     * BADGES / STATUS
     * ========================= */
    badge: {
        success:
            'bg-green-100 text-green-700',
        warning:
            'bg-yellow-100 text-yellow-700',
        danger:
            'bg-red-100 text-red-700',
        info:
            'bg-blue-100 text-blue-700',
    },

    /* =========================
     * FOOTER
     * ========================= */
    footer: {
        container:
            'bg-slate-900 text-slate-400 text-sm',
        link:
            'hover:text-white transition',
    },

    /* =========================
     * BACKGROUNDS
     * ========================= */
    background: {
        page:
            'bg-slate-50',
        dashboard:
            'bg-slate-100',
    },
}
