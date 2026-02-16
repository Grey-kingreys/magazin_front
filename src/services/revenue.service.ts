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



export const revenueService = {
    // Créer une recette
    async createRevenue(data: any) {
        return fetchApiAuth('/revenue', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Récupérer toutes les recettes
    async getRevenues(
        page = 1,
        limit = 50,
        storeId?: string,
        category?: string,
        startDate?: string,
        endDate?: string,
        search?: string
    ) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (storeId) params.append('storeId', storeId);
        if (category) params.append('category', category);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (search) params.append('search', search);

        return fetchApiAuth(`/revenue?${params.toString()}`);
    },

    // Récupérer une recette par ID
    async getRevenue(revenueId: string) {
        return fetchApiAuth(`/revenue/${revenueId}`);
    },

    // Mettre à jour une recette
    async updateRevenue(revenueId: string, data: any) {
        return fetchApiAuth(`/revenue/${revenueId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    // Supprimer une recette
    async deleteRevenue(revenueId: string) {
        return fetchApiAuth(`/revenue/${revenueId}`, {
            method: 'DELETE',
        });
    },

    // Récupérer les statistiques
    async getStats(storeId?: string, startDate?: string, endDate?: string) {
        const params = new URLSearchParams();
        if (storeId) params.append('storeId', storeId);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        return fetchApiAuth(`/revenue/stats?${params.toString()}`);
    },

    // Récupérer les catégories
    async getCategories() {
        return fetchApiAuth('/revenue/categories');
    },
}