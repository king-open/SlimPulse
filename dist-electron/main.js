"use strict";
const { app, BrowserWindow, session } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";
function createWindow() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https:",
          "connect-src 'self' http://localhost:3000 https://api.example.com"
        ].join("; ")
      }
    });
  });
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      sandbox: true,
      webSecurity: true
    }
  });
  if (isDev) {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  win.webContents.setWindowOpenHandler(() => {
    return { action: "deny" };
  });
}
app.whenReady().then(() => {
  app.on("web-contents-created", (event, contents) => {
    contents.on("will-navigate", (event2, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      if (parsedUrl.origin !== "http://localhost:3000") {
        event2.preventDefault();
      }
    });
    contents.setWindowOpenHandler(() => {
      return { action: "deny" };
    });
  });
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.setAsDefaultProtocolClient("fitness-check");
