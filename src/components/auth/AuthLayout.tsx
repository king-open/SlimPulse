import React from 'react'
import { Card } from 'antd'
import { motion } from 'framer-motion'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Fitness Check
          </h1>
          <p className="text-gray-500">记录健康，改变生活</p>
        </div>
        
        <Card 
          className="w-full shadow-2xl hover:shadow-3xl transition-shadow duration-300"
          bordered={false}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-2">{subtitle}</p>
          </div>
          {children}
        </Card>

        <div className="text-center mt-6 text-gray-600 text-sm">
          © {new Date().getFullYear()} Fitness Check. All rights reserved.
        </div>
      </motion.div>
    </div>
  )
}

export default AuthLayout 
