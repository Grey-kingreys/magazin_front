// Service API centralisé pour toutes les requêtes backend
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

// ==================== AUTH SERVICE ====================

export const authService = {
    // Connexion
    async login(email: string, password: string) {
        return fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })
    },

    // Inscription
    async register(name: string, email: string, password: string) {
        return fetchApi('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        })
    },

    // Mot de passe oublié
    async forgotPassword(email: string) {
        return fetchApi('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        })
    },

    // Réinitialisation de mot de passe
    async resetPassword(token: string, newPassword: string) {
        return fetchApi('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
        })
    },

    // Vérifier token de reset
    async verifyResetToken(token: string) {
        return fetchApi(`/auth/verify-reset-token/${token}`)
    },

    // Récupérer le profil utilisateur
    async getProfile() {
        return fetchApiAuth('/auth')
    },

    // Modifier le profil utilisateur (Nouvelle méthode)
    async editProfile(data: { name?: string; email?: string }) {
        return fetchApiAuth('/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    },

    // Vérifier la validité du token JWT
    async verifyToken() {
        return fetchApiAuth('/auth/verify')
    },

    // Déconnexion (côté client)
    logout() {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
    },
}

// ==================== USER SERVICE ====================

export const userService = {
    // Récupérer tous les utilisateurs
    async getUsers() {
        return fetchApiAuth('/users')
    },

    // Récupérer un utilisateur par ID
    async getUser(userId: string) {
        return fetchApiAuth(`/users/${userId}`)
    },

    // Récupérer les statistiques des utilisateurs
    async getStats() {
        return fetchApiAuth('/users/stats')
    },

    // Créer un utilisateur (Admin uniquement)
    async createUser(data: {
        name: string
        email: string
        password: string
        role: string
        storeId?: string
    }) {
        // Log pour debug
        console.log('Données envoyées à createUser:', data)

        // Créer un objet propre sans undefined
        const cleanData: any = {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role
        }

        // Ajouter storeId seulement si défini et non vide
        if (data.storeId && data.storeId.trim() !== '') {
            cleanData.storeId = data.storeId
        }

        const returnData = await fetchApiAuth('/users', {
            method: 'POST',
            body: JSON.stringify(cleanData),
        })

        console.log('Réponse de createUser:', returnData)
        return returnData
    },

    // Mettre à jour un utilisateur
    async updateUser(userId: string, data: any) {
        return fetchApiAuth(`/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    },

    // Activer/Désactiver un utilisateur
    async toggleActive(userId: string) {
        return fetchApiAuth(`/users/${userId}/toggle-active`, {
            method: 'PATCH',
        })
    },

    // Supprimer un utilisateur
    async deleteUser(userId: string) {
        return fetchApiAuth(`/users/${userId}`, {
            method: 'DELETE',
        })
    },

    // Modifier son propre mot de passe
    async changeOwnPassword(currentPassword: string, newPassword: string) {
        return fetchApiAuth('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
        })
    },

    // Modifier le mot de passe d'un utilisateur (Admin)
    async changeUserPassword(userId: string, newPassword: string) {
        return fetchApiAuth(`/users/${userId}/change-password`, {
            method: 'POST',
            body: JSON.stringify({ newPassword }),
        })
    },
}

// ==================== EXPORT ====================

export { API_URL }