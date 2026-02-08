
// Service API pour la gestion des mouvements de stock
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

export const stockMovementService = {
    // Récupérer tous les mouvements
    async getMovements(
        page = 1,
        limit = 50,
        storeId?: string,
        productId?: string,
        userId?: string,
        type?: string,
        startDate?: string,
        endDate?: string
    ) {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (storeId) params.append('storeId', storeId)
        if (productId) params.append('productId', productId)
        if (userId) params.append('userId', userId)
        if (type) params.append('type', type)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const queryString = params.toString()
        return fetchApiAuth(`/stock-movement?${queryString}`)
    },

    // Récupérer un mouvement par ID
    async getMovement(movementId: string) {
        return fetchApiAuth(`/stock-movement/${movementId}`)
    },

    // Créer un mouvement de stock
    async createMovement(data: {
        productId: string
        storeId: string
        userId: string
        type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT'
        quantity: number
        reference?: string
        notes?: string
        fromStoreId?: string
        toStoreId?: string
    }) {
        return fetchApiAuth('/stock-movement', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    // Modifier un mouvement de stock
    async updateMovement(movementId: string, data: {
        type?: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT'
        quantity?: number
        reference?: string
        notes?: string
        storeId?: string
        fromStoreId?: string
        toStoreId?: string
    }) {
        return fetchApiAuth(`/stock-movement/${movementId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    },

    // Supprimer un mouvement de stock
    async deleteMovement(movementId: string) {
        return fetchApiAuth(`/stock-movement/${movementId}`, {
            method: 'DELETE',
        })
    },

    // Récupérer les statistiques
    async getStats(startDate?: string, endDate?: string) {
        const params = new URLSearchParams()
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const queryString = params.toString()
        return fetchApiAuth(`/stock-movement/stats${queryString ? `?${queryString}` : ''}`)
    },

    // Récupérer l'historique d'un produit
    async getProductHistory(
        productId: string,
        page = 1,
        limit = 50,
        storeId?: string
    ) {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (storeId) params.append('storeId', storeId)

        const queryString = params.toString()
        return fetchApiAuth(`/stock-movement/product/${productId}/history?${queryString}`)
    },
}
