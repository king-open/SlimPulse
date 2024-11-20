import React from 'react'
import { Result, Button } from 'antd'
import { motion } from 'framer-motion'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[400px] flex items-center justify-center"
    >
      <Result
        status="error"
        title="出错了"
        subTitle={error.message || '发生了一些错误，请稍后重试'}
        extra={[
          <Button key="retry" type="primary" onClick={resetErrorBoundary}>
            重试
          </Button>
        ]}
      />
    </motion.div>
  )
}

export default ErrorFallback 
