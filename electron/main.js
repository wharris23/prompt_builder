const { app, BrowserWindow, Tray, nativeImage, globalShortcut, ipcMain, clipboard, Menu } = require('electron');
const path = require('path');

let tray = null;
let mainWindow = null;

function createTray() {
  // Create a 16x16 icon programmatically for the tray
  // Using a simple lightning bolt shape encoded as base64 PNG
  const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADlSURBVDiNpZMxDoJAEEV/FBdYaEIPx7DwCB7BCko6zqC2NNR6AQzEWBLYAktWJpawFhMyxlL2b/5kJjNZ4E8hCl4+h59DH4CkBxiA58n5CmwM49tsBnPgDpz35CLJoTPCvMNH3fk7AtdO8Qg0gXJ1IAZ2wKt1NoFbIFleeANrTqWOPT/AAZM0D3Y6+6TnZzAlRa2TdQVR8nLKelKRPMv7AsxJi3oNPKLkpVtUsjokrYAPGLiAiLTYI0peTrVxEYxI80UwDlYASLMVApJMgzUIclK0BzZAuOEJuC0bP+AfsP0OB98Bd5T7b++wJekAAAAASUVORK5CYII=';
  
  const icon = nativeImage.createFromBuffer(Buffer.from(iconBase64, 'base64'));
  icon.setTemplateImage(true);
  
  tray = new Tray(icon);
  tray.setToolTip('Prompt Compiler - ⌘⇧P');
  
  tray.on('click', (event, bounds) => {
    toggleWindow(bounds);
  });

  // Right-click menu
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => showWindow(tray.getBounds()) },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.isQuitting = true; app.quit(); } }
  ]);
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 520,
    show: false,
    frame: false,
    resizable: false,
    transparent: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    skipTaskbar: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('popup.html');
  
  // Hide window when it loses focus
  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });
  
  // Prevent window from being closed, just hide it
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function toggleWindow(trayBounds) {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow(trayBounds);
  }
}

function showWindow(trayBounds) {
  const { x, y } = trayBounds || { x: 100, y: 0 };
  const { width } = mainWindow.getBounds();
  
  // Position window below tray icon
  const windowX = Math.round(x - width / 2 + (trayBounds?.width || 0) / 2);
  const windowY = y + (trayBounds?.height || 0) + 4;
  
  mainWindow.setPosition(Math.max(0, windowX), windowY);
  mainWindow.show();
  mainWindow.focus();
  
  mainWindow.webContents.send('focus-input');
}

function registerShortcuts() {
  const ret = globalShortcut.register('CommandOrControl+Shift+P', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      const trayBounds = tray?.getBounds() || { x: 100, y: 0, width: 0, height: 0 };
      showWindow(trayBounds);
    }
  });
  
  if (!ret) {
    console.log('Global shortcut registration failed');
  }
}

// IPC Handlers
ipcMain.handle('copy-to-clipboard', (event, text) => {
  clipboard.writeText(text);
  return true;
});

ipcMain.handle('hide-window', () => {
  mainWindow.hide();
});

ipcMain.handle('get-clipboard', () => {
  return clipboard.readText();
});

// App lifecycle
app.whenReady().then(() => {
  // Hide from dock on macOS
  if (process.platform === 'darwin') {
    app.dock.hide();
  }
  
  createWindow();
  createTray();
  registerShortcuts();
  
  console.log('Prompt Compiler is running. Click the tray icon or press ⌘+Shift+P');
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

app.on('window-all-closed', (e) => {
  // Prevent app from quitting when window is closed
  e.preventDefault();
});

app.on('activate', () => {
  if (mainWindow) {
    showWindow(tray?.getBounds());
  }
});
