import React from 'react'
import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ToolOutlined, HomeOutlined, RollbackOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const UnderConstruction: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center p-8 relative">
        {/* 装饰性齿轮动画 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <ToolOutlined className="text-8xl text-gray-100" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <ToolOutlined className="text-7xl text-gray-100" />
          </motion.div>
        </div>

        {/* 主要内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="mb-8">
            <motion.div
              animate={{ 
                rotateZ: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="inline-block"
            >
              <ToolOutlined className="text-6xl text-primary" />
            </motion.div>
          </div>

          <div className="space-y-4 mb-8">
            <Title level={2} className="!mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                功能开发中
              </span>
            </Title>
            <Text className="block text-gray-500 text-lg">
              我们正在努力开发这项功能，敬请期待！
            </Text>
          </div>

          {/* 阴影卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto mb-8 p-6 bg-white rounded-xl shadow-2xl"
          >
            <div className="space-y-2 text-left">
              <Text className="block text-gray-600">
                <span className="font-semibold">预计完成时间：</span> 2024年Q2
              </Text>
              <Text className="block text-gray-600">
                <span className="font-semibold">开发进度：</span> 30%
              </Text>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: '30%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          <div className="space-x-4">
            <Button 
              type="primary"
              icon={<HomeOutlined />}
              size="large"
              onClick={() => navigate('/')}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              返回首页
            </Button>
            <Button
              icon={<RollbackOutlined />}
              size="large"
              onClick={() => navigate(-1)}
              className="shadow hover:shadow-lg transition-shadow"
            >
              返回上页
            </Button>
          </div>
        </motion.div>

        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ filter: 'blur(4px)' }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ filter: 'blur(4px)' }}
          />
        </div>
      </div>
    </div>
  )
}

export default UnderConstruction 
