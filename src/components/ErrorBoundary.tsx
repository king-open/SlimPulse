import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { motion } from 'framer-motion'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return children
}

export const ErrorFallback = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  const getErrorMessage = (error: unknown) => {
    // 处理路由错误
    if (isRouteErrorResponse(error)) {
      if (error.status === 404) {
        return {
          status: '404',
          title: '页面不存在',
          subTitle: '抱歉，您访问的页面不存在。',
        }
      }
      if (error.status === 403) {
        return {
          status: '403',
          title: '访问受限',
          subTitle: '抱歉，您没有权限访问此页面。',
        }
      }
      return {
        status: '500',
        title: '系统错误',
        subTitle: error.statusText || '抱歉，系统出现了一些问题。',
      }
    }

    // 处理其他错误
    if (error instanceof Error) {
      return {
        status: 'error',
        title: '发生错误',
        subTitle: error.message || '抱歉，系统出现了一些问题。',
      }
    }

    // 默认错误信息
    return {
      status: 'error',
      title: '未知错误',
      subTitle: '抱歉，系统出现了一些问题。',
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <Result
        status={errorInfo.status as any}
        title={errorInfo.title}
        subTitle={errorInfo.subTitle}
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            返回首页
          </Button>,
          <Button key="retry" onClick={() => window.location.reload()}>
            重试
          </Button>,
        ]}
      />
    </motion.div>
  )
}

export default ErrorBoundary 
