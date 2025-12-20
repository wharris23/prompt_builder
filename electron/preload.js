const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),
  hideWindow: () => ipcRenderer.invoke('hide-window'),
  getClipboard: () => ipcRenderer.invoke('get-clipboard'),
  onFocusInput: (callback) => ipcRenderer.on('focus-input', callback)
});
