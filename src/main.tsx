import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { NotificationProvider } from './contexts/NotificationContext'
import { store } from './store'
import { router } from './router'
import 'virtual:uno.css'
import './styles/index.css'

// 使用立即执行的异步函数来初始化
const init = async () => {
  // 在开发环境下启动 MSW
  if (process.env.NODE_ENV === 'development') {
    const { startWorker } = await import('./mocks/browser')
    await startWorker()
  }

  // 渲染应用
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#00b96b',
            },
          }}
        >
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </ConfigProvider>
      </Provider>
    </React.StrictMode>,
  )
}

init().catch(console.error)
