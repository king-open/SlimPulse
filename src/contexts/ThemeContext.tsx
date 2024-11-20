import React, { createContext, useContext, useState, useEffect } from 'react'
import { ConfigProvider, theme } from 'antd'
import { ThemeConfig } from 'antd/es/config-provider/context'
import { storageService } from '../services/storage'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#00b96b',
    borderRadius: 8,
  },
}

const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#00b96b',
    borderRadius: 8,
  },
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [mode, setMode] = useState<ThemeMode>(
    (storageService.get('themeMode') as ThemeMode) || 'light'
  )

  useEffect(() => {
    storageService.set('themeMode', mode)
    // 设置 body 的类名以支持全局样式
    document.body.className = mode === 'dark' ? 'dark' : ''
  }, [mode])

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ConfigProvider theme={mode === 'light' ? lightTheme : darkTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 
