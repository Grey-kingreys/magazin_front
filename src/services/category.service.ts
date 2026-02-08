// Service API pour la gestion des catégories
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

export const categoryService = {
    // Récupérer toutes les catégories
    async getCategories(page = 1, limit = 50, search?: string) {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (search) params.append('search', search)

        const queryString = params.toString()
        return fetchApiAuth(`/category?${queryString}`)
    },

    // Récupérer une catégorie par ID
    async getCategory(categoryId: string) {
        return fetchApiAuth(`/category/${categoryId}`)
    },

    // Créer une catégorie
    async createCategory(data: {
        name: string
        description?: string
    }) {
        return fetchApiAuth('/category', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    // Mettre à jour une catégorie
    async updateCategory(categoryId: string, data: any) {
        return fetchApiAuth(`/category/${categoryId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    },

    // Supprimer une catégorie
    async deleteCategory(categoryId: string) {
        return fetchApiAuth(`/category/${categoryId}`, {
            method: 'DELETE',
        })
    },

    // Récupérer les statistiques
    async getStats() {
        return fetchApiAuth('/category/stats')
    },

    // Récupérer les produits d'une catégorie
    async getCategoryProducts(categoryId: string, page = 1, limit = 20) {
        return fetchApiAuth(`/category/${categoryId}/products?page=${page}&limit=${limit}`)
    },
}