// Service API pour la gestion des magasins
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

export const storeService = {
    // Récupérer tous les magasins
    async getStores(page = 1, limit = 50, search?: string, isActive?: boolean, city?: string) {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (search) params.append('search', search)
        if (isActive !== undefined) params.append('isActive', isActive.toString())
        if (city) params.append('city', city)

        const queryString = params.toString()
        return fetchApiAuth(`/store?${queryString}`)
    },

    // Récupérer un magasin par ID
    async getStore(storeId: string) {
        return fetchApiAuth(`/store/${storeId}`)
    },

    // Créer un magasin
    async createStore(data: {
        name: string
        email?: string
        phone?: string
        address?: string
        city?: string
    }) {
        return fetchApiAuth('/store', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    // Mettre à jour un magasin
    async updateStore(storeId: string, data: any) {
        return fetchApiAuth(`/store/${storeId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    },

    // Activer/Désactiver un magasin
    async toggleActive(storeId: string) {
        return fetchApiAuth(`/store/${storeId}/toggle-active`, {
            method: 'PATCH',
        })
    },

    // Supprimer un magasin
    async deleteStore(storeId: string) {
        return fetchApiAuth(`/store/${storeId}`, {
            method: 'DELETE',
        })
    },

    // Récupérer les statistiques
    async getStats() {
        return fetchApiAuth('/store/stats')
    },

    // Récupérer les villes
    async getCities() {
        return fetchApiAuth('/store/cities')
    },

    // Récupérer les utilisateurs d'un magasin
    async getStoreUsers(storeId: string, page = 1, limit = 20) {
        return fetchApiAuth(`/store/${storeId}/users?page=${page}&limit=${limit}`)
    },

    // Récupérer les stocks d'un magasin
    async getStoreStocks(storeId: string, page = 1, limit = 50) {
        return fetchApiAuth(`/store/${storeId}/stocks?page=${page}&limit=${limit}`)
    },
}