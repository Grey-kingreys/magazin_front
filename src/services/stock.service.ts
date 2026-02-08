// Service API pour la gestion des stocks
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

export const stockService = {
    // Récupérer tous les stocks
    async getStocks(
        page = 1,
        limit = 50,
        search?: string,
        storeId?: string,
        productId?: string,
        lowStock?: boolean
    ) {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (search) params.append('search', search)
        if (storeId) params.append('storeId', storeId)
        if (productId) params.append('productId', productId)
        if (lowStock !== undefined) params.append('lowStock', lowStock.toString())

        const queryString = params.toString()
        return fetchApiAuth(`/stock?${queryString}`)
    },

    // Récupérer un stock par ID
    async getStock(stockId: string) {
        return fetchApiAuth(`/stock/${stockId}`)
    },

    // Récupérer le stock d'un produit dans un magasin
    async getStockByProductAndStore(productId: string, storeId: string) {
        return fetchApiAuth(`/stock/product/${productId}/store/${storeId}`)
    },

    // Récupérer les stocks d'un magasin
    async getStocksByStore(storeId: string, page = 1, limit = 50) {
        return fetchApiAuth(`/stock/store/${storeId}?page=${page}&limit=${limit}`)
    },

    // Créer un stock
    async createStock(data: {
        productId: string
        storeId: string
        quantity: number
    }) {
        return fetchApiAuth('/stock', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    // Mettre à jour un stock (ajustement manuel)
    async updateStock(stockId: string, quantity: number) {
        return fetchApiAuth(`/stock/${stockId}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
        })
    },

    // Supprimer un stock
    async deleteStock(stockId: string) {
        return fetchApiAuth(`/stock/${stockId}`, {
            method: 'DELETE',
        })
    },

    // Récupérer les statistiques
    async getStats() {
        return fetchApiAuth('/stock/stats')
    },

    // Récupérer les stocks faibles
    async getLowStocks(page = 1, limit = 50, storeId?: string) {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (storeId) params.append('storeId', storeId)

        const queryString = params.toString()
        return fetchApiAuth(`/stock/low-stock?${queryString}`)
    },
}