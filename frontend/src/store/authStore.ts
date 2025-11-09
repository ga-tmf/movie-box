import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  authService,
  type LoginCredentials,
  type RegisterData,
} from '@/services/authService'

interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
}

interface AuthStore {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  setAuth: (user: User, token: string) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: async (credentials: LoginCredentials) => {
        try {
          const response = await authService.login(credentials)
          set({
            isAuthenticated: true,
            user: response.user,
            token: response.token,
          })
        } catch (error) {
          console.error('Login failed:', error)
          throw error
        }
      },
      register: async (userData: RegisterData) => {
        try {
          const response = await authService.register(userData)
          set({
            isAuthenticated: true,
            user: response.user,
            token: response.token,
          })
        } catch (error) {
          console.error('Registration failed:', error)
          throw error
        }
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        })
      },
      setAuth: (user: User, token: string) => {
        set({
          isAuthenticated: true,
          user,
          token,
        })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
