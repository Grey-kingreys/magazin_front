// Service API pour la gestion des fournisseurs
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

export const supplierService = {
    // Récupérer tous les fournisseurs
    async getSuppliers(
        page = 1,
        limit = 50,
        search?: string,
        isActive?: boolean,
        city?: string,
        country?: string
    ) {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (search) params.append('search', search)
        if (isActive !== undefined) params.append('isActive', isActive.toString())
        if (city) params.append('city', city)
        if (country) params.append('country', country)

        const queryString = params.toString()
        return fetchApiAuth(`/supplier?${queryString}`)
    },

    // Récupérer un fournisseur par ID
    async getSupplier(supplierId: string) {
        return fetchApiAuth(`/supplier/${supplierId}`)
    },

    // Créer un fournisseur
    async createSupplier(data: {
        name: string
        email?: string
        phone?: string
        address?: string
        city?: string
        country?: string
        taxId?: string
    }) {
        return fetchApiAuth('/supplier', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    // Mettre à jour un fournisseur
    async updateSupplier(supplierId: string, data: any) {
        return fetchApiAuth(`/supplier/${supplierId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    },

    // Activer/Désactiver un fournisseur
    async toggleActive(supplierId: string) {
        return fetchApiAuth(`/supplier/${supplierId}/toggle-active`, {
            method: 'PATCH',
        })
    },

    // Supprimer un fournisseur
    async deleteSupplier(supplierId: string) {
        return fetchApiAuth(`/supplier/${supplierId}`, {
            method: 'DELETE',
        })
    },

    // Récupérer les statistiques
    async getStats() {
        return fetchApiAuth('/supplier/stats')
    },

    // Récupérer les villes
    async getCities() {
        return fetchApiAuth('/supplier/cities')
    },

    // Récupérer les pays
    async getCountries() {
        return fetchApiAuth('/supplier/countries')
    },

    // Récupérer les produits d'un fournisseur
    async getSupplierProducts(supplierId: string, page = 1, limit = 20) {
        return fetchApiAuth(`/supplier/${supplierId}/products?page=${page}&limit=${limit}`)
    },
}