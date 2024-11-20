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

async function startApp() {
  if (import.meta.env.DEV) {
    const { initMocks } = await import('./mocks/config')
    await initMocks()
  }

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

startApp()
