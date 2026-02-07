// Service pour récupérer les données du dashboard
import { API_URL } from './api.service'

interface ApiResponse<T = any> {
    data: T | null
    message: string
    success: boolean
}

// Fonction helper pour les requêtes authentifiées
async function fetchApiAuth<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const token = localStorage.getItem('access_token')

        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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

export const dashboardService = {
    // Récupérer la vue d'ensemble du dashboard
    async getOverview(storeId?: string, startDate?: string, endDate?: string) {
        const params = new URLSearchParams()
        if (storeId) params.append('storeId', storeId)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const queryString = params.toString()
        return fetchApiAuth(`/dashboard/overview${queryString ? `?${queryString}` : ''}`)
    },

    // Récupérer la comparaison de performance
    async getPerformanceComparison(storeId?: string, startDate?: string, endDate?: string) {
        const params = new URLSearchParams()
        if (storeId) params.append('storeId', storeId)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const queryString = params.toString()
        return fetchApiAuth(`/dashboard/performance${queryString ? `?${queryString}` : ''}`)
    },

    // Récupérer le dashboard des caisses
    async getCashRegisterDashboard(storeId?: string) {
        const params = new URLSearchParams()
        if (storeId) params.append('storeId', storeId)

        const queryString = params.toString()
        return fetchApiAuth(`/dashboard/cash-registers${queryString ? `?${queryString}` : ''}`)
    },
}