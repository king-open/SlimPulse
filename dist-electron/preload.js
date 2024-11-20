"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  // 系统信息
  platform: process.platform,
  // 窗口操作
  window: {
    minimize: () => ipcRenderer.send("window:minimize"),
    maximize: () => ipcRenderer.send("window:maximize"),
    close: () => ipcRenderer.send("window:close")
  },
  // 存储操作
  store: {
    get: (key) => ipcRenderer.invoke("store:get", key),
    set: (key, value) => ipcRenderer.invoke("store:set", key, value),
    delete: (key) => ipcRenderer.invoke("store:delete", key)
  },
  // 通知
  notification: {
    show: (title, body) => ipcRenderer.invoke("notification:show", { title, body })
  }
});
