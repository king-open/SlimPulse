import { User } from '../types'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  email: string
  phone: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// 超级用户模式
const SUPER_USER: User = {
  id: 'super_user',
  username: 'admin',
  email: 'admin@example.com',
  phone: '13800138000',
  membershipType: 'premium',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
}

const SUPER_USER_PASSWORD = '123456'

export const authApi = {
  login: async (data: LoginParams): Promise<AuthResponse> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    if (data.username === 'admin' && data.password === SUPER_USER_PASSWORD) {
      return {
        token: 'super_user_token',
        user: SUPER_USER,
      }
    }

    throw new Error('用户名或密码错误')
  },

  register: async (data: RegisterParams): Promise<AuthResponse> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 创建新用户
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: data.username,
      email: data.email,
      phone: data.phone,
      membershipType: 'free',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
    }

    return {
      token: `token_${Date.now()}`,
      user: newUser,
    }
  },

  getCurrentUser: async (): Promise<User> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    const token = localStorage.getItem('token')
    if (token === 'super_user_token') {
      return SUPER_USER
    }

    throw new Error('未登录')
  },

  logout: async (): Promise<void> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    // 清除本地存储的 token
    localStorage.removeItem('token')
  },
} 
