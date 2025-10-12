// Authentication utilities and types

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  userType: 'renter' | 'landlord' | 'agent'
  location: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface SignInCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignUpData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  userType: 'renter' | 'landlord' | 'agent'
  location: string
  agreeToTerms: boolean
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}

// Mock authentication functions (replace with real API calls)
export const authService = {
  async signIn(credentials: SignInCredentials): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (credentials.email === 'demo@nuloafrica.com' && credentials.password === 'password123') {
      return {
        user: {
          id: '1',
          email: credentials.email,
          firstName: 'Demo',
          lastName: 'User',
          phone: '+234 800 123 4567',
          userType: 'renter',
          location: 'lagos',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token: 'mock-jwt-token'
      }
    }
    
    throw new Error('Invalid credentials')
  },

  async signUp(data: SignUpData): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        userType: data.userType,
        location: data.location,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      token: 'mock-jwt-token'
    }
  },

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real app, this would send an email
    console.log(`Password reset email sent to ${data.email}`)
  },

  async resetPassword(data: ResetPasswordData): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match')
    }
    
    console.log(`Password reset for token ${data.token}`)
  },

  async signOut(): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // In a real app, this would clear the token
    console.log('User signed out')
  },

  async getCurrentUser(): Promise<User | null> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // In a real app, this would validate the token and return user data
    const token = localStorage.getItem('auth-token')
    if (!token) return null
    
    return {
      id: '1',
      email: 'demo@nuloafrica.com',
      firstName: 'Demo',
      lastName: 'User',
      phone: '+234 800 123 4567',
      userType: 'renter',
      location: 'lagos',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}

// Validation helpers
export const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validatePhone = (phone: string): boolean => {
  return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''))
}

// Storage helpers
export const storage = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token)
    }
  },
  
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token')
    }
    return null
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token')
    }
  },
  
  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-user', JSON.stringify(user))
    }
  },
  
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('auth-user')
      return user ? JSON.parse(user) : null
    }
    return null
  },
  
  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-user')
    }
  }
}
