import { API_URL } from './api.service'

interface ApiResponse<T = any> {
    data: T | null
    message: string
    success: boolean
}

// Interface pour la réponse de getCashRegisters
interface CashRegisterResponseData {
    cashRegisters: Array<{
        id: string
        store: {
            id: string
            name: string
            city: string
        }
        user: {
            id: string
            name: string
            email: string
        }
        openingAmount: number
        availableAmount: number // ⭐ Ajouté
        closingAmount: number | null
        expectedAmount: number | null
        difference: number | null
        status: 'OPEN' | 'CLOSED'
        openedAt: string
        closedAt: string | null
        _count?: {
            sales: number
        }
        stats?: {
            expectedAmount?: number
            cashSalesTotal?: number
        }
    }>
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasMore: boolean
    }
}

// Interface pour la réponse de getCashRegister
interface SingleCashRegisterData {
    id: string
    store: {
        id: string
        name: string
        city: string
    }
    user: {
        id: string
        name: string
        email: string
    }
    openingAmount: number
    availableAmount: number // ⭐ Ajouté
    closingAmount: number | null
    expectedAmount: number | null
    difference: number | null
    status: 'OPEN' | 'CLOSED'
    openedAt: string
    closedAt: string | null
    notes: string | null
    stats?: {
        totalRevenue: number
        salesCount: number
        expectedAmount: number
        cashSalesTotal: number
    }
}

// Interface pour les statistiques
interface CashRegisterStatsData {
    totalCashRegisters: number
    openCashRegisters: number
    closedCashRegisters: number
    totalRevenue: number
    totalDifference: number
    positiveDiscrepancies: number
    negativeDiscrepancies: number
    perfectMatches: number
    totalOpeningAmount?: number
    totalClosingAmount?: number
    totalCashSales?: number
    totalNonCashSales?: number
    totalSales?: number
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

export const cashRegisterService = {
    // Ouvrir une caisse
    async openCashRegister(data: {
        storeId: string
        openingAmount: number
        notes?: string
    }) {
        return fetchApiAuth('/cash-register/open', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    // Fermer une caisse
    async closeCashRegister(cashRegisterId: string, data: {
        closingAmount: number
        notes?: string
    }) {
        return fetchApiAuth(`/cash-register/${cashRegisterId}/close`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    },

    // Récupérer toutes les caisses
    async getCashRegisters(
        page = 1,
        limit = 50,
        storeId?: string,
        status?: 'OPEN' | 'CLOSED',
        startDate?: string,
        endDate?: string
    ) {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (storeId) params.append('storeId', storeId)
        if (status) params.append('status', status)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const queryString = params.toString()
        return fetchApiAuth<CashRegisterResponseData>(`/cash-register?${queryString}`)
    },

    // Récupérer une caisse par ID
    async getCashRegister(cashRegisterId: string) {
        return fetchApiAuth<SingleCashRegisterData>(`/cash-register/${cashRegisterId}`)
    },

    // Récupérer ma caisse ouverte
    async getMyOpenRegister() {
        return fetchApiAuth<SingleCashRegisterData>('/cash-register/my-open-register')
    },

    // Récupérer les statistiques
    async getStats(storeId?: string, startDate?: string, endDate?: string) {
        const params = new URLSearchParams()
        if (storeId) params.append('storeId', storeId)
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const queryString = params.toString()
        return fetchApiAuth<CashRegisterStatsData>(`/cash-register/stats${queryString ? `?${queryString}` : ''}`)
    },

    // Supprimer une caisse (Admin uniquement)
    async deleteCashRegister(cashRegisterId: string) {
        return fetchApiAuth(`/cash-register/${cashRegisterId}`, {
            method: 'DELETE',
        })
    },

    // Mettre à jour une caisse ouverte
    async updateCashRegister(cashRegisterId: string, data: {
        openingAmount?: number
        notes?: string
    }) {
        return fetchApiAuth(`/cash-register/${cashRegisterId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    },
}