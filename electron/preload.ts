const { contextBridge, ipcRenderer } = require('electron')

export type ElectronAPI = {
  platform: string
  window: {
    minimize: () => void
    maximize: () => void
    close: () => void
  }
  store: {
    get: (key: string) => Promise<any>
    set: (key: string, value: any) => Promise<void>
    delete: (key: string) => Promise<void>
  }
  notification: {
    show: (title: string, body: string) => Promise<void>
  }
}

// 定义暴露给渲染进程的 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 系统信息
  platform: process.platform,
  
  // 窗口操作
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
  },

  // 存储操作
  store: {
    get: (key: string) => ipcRenderer.invoke('store:get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('store:set', key, value),
    delete: (key: string) => ipcRenderer.invoke('store:delete', key),
  },

  // 通知
  notification: {
    show: (title: string, body: string) => 
      ipcRenderer.invoke('notification:show', { title, body }),
  },
} as ElectronAPI)

// 声明全局类型
declare global {
  interface Window {
    electronAPI: {
      platform: string
      window: {
        minimize: () => void
        maximize: () => void
        close: () => void
      }
      store: {
        get: (key: string) => Promise<any>
        set: (key: string, value: any) => Promise<void>
        delete: (key: string) => Promise<void>
      }
      notification: {
        show: (title: string, body: string) => Promise<void>
      }
    }
  }
} 
