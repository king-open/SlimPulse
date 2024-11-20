import React from 'react'
import { Form, Input, Button, Spin, Steps } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { notificationService } from '../services/notification'
import AuthLayout from '../components/auth/AuthLayout'

interface RegisterFormValues {
  username: string
  email: string
  phone: string
  password: string
  confirm: string
}

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = React.useState(0)

  const onFinish = async (values: RegisterFormValues) => {
    try {
      console.log('注册表单数据:', values)
      await register(values)
      notificationService.success('注册成功', '欢迎加入！')
      navigate('/login')
    } catch (err) {
      console.error('注册错误:', err)
      notificationService.error(
        '注册失败',
        err instanceof Error ? err.message : '请检查网络连接或稍后重试'
      )
    }
  }

  // 定义每个步骤需要验证的字段
  const stepFields = [
    ['username', 'email'],
    ['phone'],
    ['password', 'confirm']
  ]

  const next = async () => {
    try {
      // 只验证当前步骤的字段
      await form.validateFields(stepFields[currentStep])
      setCurrentStep(currentStep + 1)
    } catch (err) {
      // 验证失败时不进行跳转
      console.error('Validation failed:', err)
    }
  }

  const prev = () => {
    setCurrentStep(currentStep - 1)
  }

  const steps = [
    {
      title: '基本信息',
      content: (
        <>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="用户名"
              className="rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱！' },
              { type: 'email', message: '请输入有效的邮箱地址！' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="邮箱"
              className="rounded-lg"
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: '联系方式',
      content: (
        <Form.Item
          name="phone"
          rules={[
            { required: true, message: '请输入手机号！' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号！' }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined className="text-gray-400" />}
            placeholder="手机号"
            className="rounded-lg"
          />
        </Form.Item>
      ),
    },
    {
      title: '设置密码',
      content: (
        <>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码长度不能小于6位！' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="密码"
              className="rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不匹配！'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="确认密码"
              className="rounded-lg"
            />
          </Form.Item>
        </>
      ),
    },
  ]

  return (
    <AuthLayout title="创建账号" subtitle="开启你的健康之旅">
      <Spin spinning={loading}>
        <Steps
          current={currentStep}
          items={steps.map(item => ({ title: item.title }))}
          className="mb-8"
        />
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          size="large"
          className="max-w-sm mx-auto"
        >
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep].content}
          </motion.div>

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button size="large" onClick={prev}>
                上一步
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" size="large" onClick={next}>
                下一步
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button 
                type="primary" 
                size="large" 
                onClick={() => form.submit()}
                loading={loading}
              >
                完成注册
              </Button>
            )}
          </div>
        </Form>

        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="text-primary hover:text-primary-dark transition-colors"
          >
            已有账号？立即登录
          </Link>
        </div>
      </Spin>
    </AuthLayout>
  )
}

export default Register 
