const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');

// Register the app protocol before app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

let appServe;
let isDev;

const loadModules = async () => {
  isDev = (await import('electron-is-dev')).default;
  if (!isDev) {
    const serve = (await import('electron-serve')).default;
    appServe = serve({
      directory: path.join(__dirname, '../out'),
    });
  }
};

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (!isDev && appServe) {
    appServe(win)
      .then(() => {
        win.loadURL('app://-');
      })
      .catch((err) => {
        console.error('Failed to serve app:', err);
      });
  } else {
    win.loadURL('http://editor.casbin.org');
    win.webContents.on('did-fail-load', () => {
      win.loadURL('http://editor.casbin.org');
    });
  }
};

app.whenReady().then(async () => {
  await loadModules();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
