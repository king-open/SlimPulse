import React from 'react'
import { Form, Input, Button, Spin, Divider } from 'antd'
import { UserOutlined, LockOutlined, GithubOutlined, GoogleOutlined } from '@ant-design/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { notificationService } from '../services/notification'
import { storageService } from '../services/storage'
import AuthLayout from '../components/auth/AuthLayout'

interface LoginFormValues {
  username: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error } = useAuth()

  const onFinish = async (values: LoginFormValues) => {
    try {
      await login(values)
      storageService.set('lastUsername', values.username)
      notificationService.success('登录成功', '欢迎回来！')
      const from = (location.state as any)?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (err) {
      notificationService.error('登录失败', error || '请检查用户名和密码')
    }
  }

  return (
    <AuthLayout title="欢迎回来" subtitle="登录你的账号">
      <Spin spinning={loading}>
        <Form
          name="login"
          initialValues={{ 
            username: storageService.get('lastUsername') || '',
            remember: true 
          }}
          onFinish={onFinish}
          size="large"
          className="max-w-sm mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名！' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="用户名/邮箱"
                autoComplete="username"
                className="rounded-lg"
              />
            </Form.Item>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="密码"
                autoComplete="current-password"
                className="rounded-lg"
              />
            </Form.Item>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading}
                className="h-12 rounded-lg text-lg font-medium"
              >
                登录
              </Button>
            </Form.Item>
          </motion.div>

          <div className="flex justify-between items-center mb-6">
            <Link 
              to="/forgot-password" 
              className="text-gray-600 hover:text-primary transition-colors"
            >
              忘记密码？
            </Link>
            <Link 
              to="/register" 
              className="text-primary hover:text-primary-dark transition-colors"
            >
              还没有账号？立即注册
            </Link>
          </div>

          <Divider className="text-gray-400">其他登录方式</Divider>

          <div className="flex justify-center space-x-6 mt-4">
            <Button 
              icon={<GithubOutlined />} 
              shape="circle" 
              size="large"
              className="hover:shadow-md transition-shadow"
            />
            <Button 
              icon={<GoogleOutlined />} 
              shape="circle" 
              size="large"
              className="hover:shadow-md transition-shadow"
            />
          </div>
        </Form>
      </Spin>
    </AuthLayout>
  )
}

export default Login 
