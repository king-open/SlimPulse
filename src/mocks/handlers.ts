import { http, HttpResponse } from 'msw'
import { User } from '../types'
import { initialUsers } from './data'

// 模拟数据存储
let users: Array<User & { password: string }> = [
  ...initialUsers.map(user => ({
    ...user,
    password: '123456' // 为测试账号设置默认密码
  }))
]
let tokens: { [key: string]: string } = {}

export const handlers = [
  // 注册
  http.post('/api/auth/register', async ({ request }) => {
    const data = await request.json() as {
      username: string
      email: string
      phone: string
      password: string
    }
    
    // 检查用户名是否已存在
    if (users.some(user => user.username === data.username)) {
      return HttpResponse.json(
        { message: '用户名已被使用' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    if (users.some(user => user.email === data.email)) {
      return HttpResponse.json(
        { message: '邮箱已被注册' },
        { status: 400 }
      )
    }

    // 创建新用户
    const newUser = {
      id: `user_${Date.now()}`,
      username: data.username,
      email: data.email,
      phone: data.phone,
      membershipType: 'free' as const,
      password: data.password,
    }

    users.push(newUser)
    const token = `token_${Date.now()}`
    tokens[token] = newUser.id

    // 返回用户信息时排除密码
    const { password, ...userWithoutPassword } = newUser
    return HttpResponse.json({
      token,
      user: userWithoutPassword,
    })
  }),

  // 登录
  http.post('/api/auth/login', async ({ request }) => {
    const data = await request.json() as {
      username: string
      password: string
    }

    const user = users.find(u => 
      (u.username === data.username || u.email === data.username) &&
      u.password === data.password
    )

    if (!user) {
      return HttpResponse.json(
        { message: '用户名或密码错误' },
        { status: 401 }
      )
    }

    const token = `token_${Date.now()}`
    tokens[token] = user.id

    // 返回用户信息时排除密码
    const { password, ...userWithoutPassword } = user
    return HttpResponse.json({
      token,
      user: userWithoutPassword,
    })
  }),

  // 获取当前用户信息
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token || !tokens[token]) {
      return HttpResponse.json(
        { message: '未授权' },
        { status: 401 }
      )
    }

    const user = users.find(u => u.id === tokens[token])
    if (!user) {
      return HttpResponse.json(
        { message: '用户不存在' },
        { status: 404 }
      )
    }

    // 返回用户信息时排除密码
    const { password, ...userWithoutPassword } = user
    return HttpResponse.json(userWithoutPassword)
  }),

  // 登出
  http.post('/api/auth/logout', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (token) {
      delete tokens[token]
    }

    return HttpResponse.json({ message: '登出成功' })
  }),
] 
