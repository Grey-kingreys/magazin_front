// Service API pour la gestion des ventes (POS)
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

export const saleService = {
    // Récupérer toutes les ventes
    async getSales(
        page = 1,
        limit = 50,
        storeId?: string,
        status?: string,
        startDate?: string,
        endDate?: string,
        search?: string
    ) {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (storeId) params.append('storeId', storeId)
        if (status) params.append('status', status)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)
        if (search) params.append('search', search)

        const queryString = params.toString()
        return fetchApiAuth(`/sale?${queryString}`)
    },

    // Récupérer une vente par ID
    async getSale(saleId: string) {
        return fetchApiAuth(`/sale/${saleId}`)
    },

    // Rechercher une vente par numéro
    async getSaleByNumber(saleNumber: string) {
        return fetchApiAuth(`/sale/number/${saleNumber}`)
    },

    // Créer une nouvelle vente
    async createSale(data: {
        storeId: string
        cashRegisterId?: string
        items: Array<{
            productId: string
            quantity: number
            unitPrice: number
        }>
        discount?: number
        tax?: number
        paymentMethod: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'CHECK'
        amountPaid: number
        notes?: string
    }) {
        return fetchApiAuth('/sale', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    // Mettre à jour le statut d'une vente
    async updateSaleStatus(saleId: string, status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED') {
        return fetchApiAuth(`/sale/${saleId}/status/${status}`, {
            method: 'PATCH',
        })
    },

    // Annuler une vente
    async cancelSale(saleId: string) {
        return fetchApiAuth(`/sale/${saleId}`, {
            method: 'DELETE',
        })
    },

    // Récupérer les statistiques des ventes
    async getStats(storeId?: string, startDate?: string, endDate?: string) {
        const params = new URLSearchParams()
        if (storeId) params.append('storeId', storeId)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const queryString = params.toString()
        return fetchApiAuth(`/sale/stats${queryString ? `?${queryString}` : ''}`)
    },

    // Récupérer les ventes du jour
    async getTodaySales(storeId?: string) {
        const params = new URLSearchParams()
        if (storeId) params.append('storeId', storeId)

        const queryString = params.toString()
        return fetchApiAuth(`/sale/today${queryString ? `?${queryString}` : ''}`)
    },
}