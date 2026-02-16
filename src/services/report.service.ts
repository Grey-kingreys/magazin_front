const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface ApiResponse<T = any> {
    data: T | null
    message: string
    success: boolean
}

// Fonction helper pour les requêtes
async function fetchApi<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        })

        const data = await response.json()
        return data
    } catch (error) {
        console.error('API Error:', error)
        return {
            data: null,
            message: 'Erreur de connexion au serveur',
            success: false,
        }
    }
}

// Fonction helper pour les requêtes authentifiées
async function fetchApiAuth<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('access_token')

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    return fetchApi<T>(endpoint, {
        ...options,
        headers,
    })
}



export const reportService = {
    // Rapport de ventes
    async getSalesReport(
        startDate?: string,
        endDate?: string,
        storeId?: string,
        groupBy: 'day' | 'week' | 'month' = 'day'
    ) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (storeId) params.append('storeId', storeId);
        params.append('groupBy', groupBy);

        return fetchApiAuth(`/report/sales?${params.toString()}`);
    },

    // Rapport de stock
    async getStockReport(storeId?: string, lowStockOnly = false) {
        const params = new URLSearchParams();
        if (storeId) params.append('storeId', storeId);
        params.append('lowStockOnly', lowStockOnly.toString());

        return fetchApiAuth(`/report/stock?${params.toString()}`);
    },

    // Rapport de mouvements de stock
    async getStockMovementsReport(
        startDate?: string,
        endDate?: string,
        storeId?: string,
        productId?: string
    ) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (storeId) params.append('storeId', storeId);
        if (productId) params.append('productId', productId);

        return fetchApiAuth(`/report/stock-movements?${params.toString()}`);
    },

    // Rapport financier
    async getFinancialReport(
        startDate?: string,
        endDate?: string,
        storeId?: string
    ) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (storeId) params.append('storeId', storeId);

        return fetchApiAuth(`/report/financial?${params.toString()}`);
    },

    // Export Excel - Ventes
    async exportSalesToExcel(
        startDate?: string,
        endDate?: string,
        storeId?: string
    ): Promise<Blob> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (storeId) params.append('storeId', storeId);

        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/report/export/sales/excel?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'export');
        }

        return response.blob();
    },

    // Export Excel - Stock
    async exportStockToExcel(storeId?: string): Promise<Blob> {
        const params = new URLSearchParams();
        if (storeId) params.append('storeId', storeId);

        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/report/export/stock/excel?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'export');
        }

        return response.blob();
    },
};
