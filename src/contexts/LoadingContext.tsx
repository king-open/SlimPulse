import React, { createContext, useContext, useState } from 'react'
import { Spin } from 'antd'

interface LoadingContextType {
  showLoading: () => void
  hideLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [loading, setLoading] = useState(false)

  const showLoading = () => setLoading(true)
  const hideLoading = () => setLoading(false)

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      <Spin spinning={loading} fullscreen>
        {children}
      </Spin>
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
} 
