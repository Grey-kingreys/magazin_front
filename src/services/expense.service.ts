// Service API pour la gestion des dépenses
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

export const expenseService = {
    // Récupérer toutes les dépenses
    async getExpenses(
        page = 1,
        limit = 50,
        storeId?: string,
        category?: string,
        startDate?: string,
        endDate?: string,
        search?: string
    ) {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (storeId) params.append('storeId', storeId)
        if (category) params.append('category', category)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)
        if (search) params.append('search', search)

        const queryString = params.toString()
        return fetchApiAuth(`/expense?${queryString}`)
    },

    // Récupérer une dépense par ID
    async getExpense(expenseId: string) {
        return fetchApiAuth(`/expense/${expenseId}`)
    },

    // Créer une dépense
    async createExpense(data: {
        storeId: string
        category: string
        description: string
        amount: number
        reference?: string
        paymentMethod?: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'CHECK'
        date?: string
    }) {
        return fetchApiAuth('/expense', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    // Mettre à jour une dépense
    async updateExpense(expenseId: string, data: any) {
        return fetchApiAuth(`/expense/${expenseId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    },

    // Supprimer une dépense
    async deleteExpense(expenseId: string) {
        return fetchApiAuth(`/expense/${expenseId}`, {
            method: 'DELETE',
        })
    },

    // Récupérer les statistiques
    async getStats(storeId?: string, startDate?: string, endDate?: string) {
        const params = new URLSearchParams()
        if (storeId) params.append('storeId', storeId)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const queryString = params.toString()
        return fetchApiAuth(`/expense/stats${queryString ? `?${queryString}` : ''}`)
    },

    // Récupérer les catégories de dépenses
    async getCategories() {
        return fetchApiAuth('/expense/categories')
    },

    // Récupérer les dépenses par catégorie
    async getExpensesByCategory(storeId?: string, startDate?: string, endDate?: string) {
        const params = new URLSearchParams()
        if (storeId) params.append('storeId', storeId)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const queryString = params.toString()
        return fetchApiAuth(`/expense/by-category${queryString ? `?${queryString}` : ''}`)
    },
}