import { app, BrowserWindow, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VITE_DEV_SERVER_URL = 'http://localhost:6001';
const MAIN_MODULE_PATH = fileURLToPath(import.meta.url);
const MAIN_DIRECTORY = path.dirname(MAIN_MODULE_PATH);
const DIST_ENTRY_PATH = path.join(MAIN_DIRECTORY, '../../dist/index.html');

const createMainWindow = async () => {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#ffffff',
    webPreferences: {
      contextIsolation: true,
      sandbox: false
    }
  });

  window.once('ready-to-show', () => {
    window.show();
  });

  const enableVerboseLogging = !app.isPackaged || process.env.ELECTRON_ENABLE_LOGGING === 'true';

  window.webContents.on('console-message', (_, level, message, line, sourceId) => {
    const prefix = level === 2 ? 'WARN' : level === 3 ? 'ERROR' : 'INFO';
    if (enableVerboseLogging || prefix === 'ERROR') {
      console.log(`[renderer:${prefix}] ${message} (${sourceId}:${line})`);
    }
  });

  window.webContents.on('dom-ready', () => {
    if (enableVerboseLogging) {
      console.log(`[main] DOM ready for ${window.webContents.getURL()}`);
    }
  });

  window.webContents.on('did-finish-load', () => {
    if (enableVerboseLogging) {
      console.log(`[main] Renderer finished loading ${window.webContents.getURL()}`);
    }
  });

  window.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error(
      `Renderer failed to load ${validatedURL} with ${errorCode} (${errorDescription})`
    );
  });

  window.webContents.on('render-process-gone', (_event, details) => {
    console.error(`Renderer process gone: ${details.reason}`);
  });

  const page = app.isPackaged
    ? DIST_ENTRY_PATH
    : VITE_DEV_SERVER_URL;

  if (enableVerboseLogging) {
    console.log(`[main] Loading page: ${page}`);
  }

  if (app.isPackaged) {
    await window.loadFile(page);
  } else {
    await window.loadURL(page);
    window.webContents.openDevTools({ mode: 'detach' });
  }

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
};

app.whenReady().then(createMainWindow).catch((error) => {
  console.error('Failed to bootstrap Electron:', error);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    void createMainWindow();
  }
});
