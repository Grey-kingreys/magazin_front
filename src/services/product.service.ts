// Service API pour la gestion des produits
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

export const productService = {
    // Récupérer tous les produits
    async getProducts(
        page = 1,
        limit = 50,
        search?: string,
        categoryId?: string,
        supplierId?: string,
        isActive?: boolean,
        lowStock?: boolean
    ) {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (search) params.append('search', search)
        if (categoryId) params.append('categoryId', categoryId)
        if (supplierId) params.append('supplierId', supplierId)
        if (isActive !== undefined) params.append('isActive', isActive.toString())
        if (lowStock !== undefined) params.append('lowStock', lowStock.toString())

        const queryString = params.toString()
        return fetchApiAuth(`/product?${queryString}`)
    },

    // Récupérer un produit par ID
    async getProduct(productId: string) {
        return fetchApiAuth(`/product/${productId}`)
    },

    // Rechercher par code-barres
    async getProductByBarcode(barcode: string) {
        return fetchApiAuth(`/product/barcode/${barcode}`)
    },

    // Rechercher par SKU
    async getProductBySku(sku: string) {
        return fetchApiAuth(`/product/sku/${sku}`)
    },

    // Créer un produit
    async createProduct(data: {
        name: string
        description?: string
        barcode?: string
        sku: string
        categoryId: string
        supplierId?: string
        costPrice: number
        sellingPrice: number
        minStock?: number
        unit?: string
    }) {
        return fetchApiAuth('/product', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    // Mettre à jour un produit
    async updateProduct(productId: string, data: any) {
        return fetchApiAuth(`/product/${productId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    },

    // Activer/Désactiver un produit
    async toggleActive(productId: string) {
        return fetchApiAuth(`/product/${productId}/toggle-active`, {
            method: 'PATCH',
        })
    },

    // Supprimer un produit
    async deleteProduct(productId: string) {
        return fetchApiAuth(`/product/${productId}`, {
            method: 'DELETE',
        })
    },

    // Récupérer les statistiques
    async getStats() {
        return fetchApiAuth('/product/stats')
    },

    // Récupérer les produits en stock faible
    async getLowStockProducts(page = 1, limit = 50) {
        return fetchApiAuth(`/product/low-stock?page=${page}&limit=${limit}`)
    },
}