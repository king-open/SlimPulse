import React from 'react'
import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const { Title, Text } = Typography

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            404
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Title level={2} className="mb-4">
            页面不见了
          </Title>
          <Text className="block text-gray-500 text-lg mb-8">
            抱歉，您访问的页面可能已被移动或不存在
          </Text>

          <div className="space-x-4">
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/')}
              className="min-w-32"
            >
              返回首页
            </Button>
            <Button 
              size="large"
              onClick={() => navigate(-1)}
              className="min-w-32"
            >
              返回上页
            </Button>
          </div>
        </motion.div>

        {/* 装饰元素 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full"
            style={{ filter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.6 }}
            className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-500 rounded-full"
            style={{ filter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-green-500 rounded-full"
            style={{ filter: 'blur(4px)' }}
          />
        </div>
      </div>
    </div>
  )
}

export default NotFound 
