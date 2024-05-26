// Copyright 2024 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

let appServe;
let isDev;

const loadModules = async () => {
  isDev = (await import('electron-is-dev')).default;
  if (!isDev) {
    const serve = (await import('electron-serve')).default;
    appServe = serve({
      directory: path.join(__dirname, 'out'),
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
    try {
      await appServe(win);
      win.loadURL('app://-');
    } catch (err) {
      console.error('Failed to serve app:', err);
      win.loadFile(path.join(__dirname, 'out/index.html'));
    }
  } else {
    win.loadFile(path.join(__dirname, 'out/index.html')).catch((err) => {
      console.error('Failed to load local file:', err);
      win.loadURL('http://editor.casbin.org');
    });

    win.webContents.on('did-fail-load', async () => {
      try {
        await win.loadFile(path.join(__dirname, 'out/index.html'));
      } catch (err) {
        console.error('Retry loading local file failed:', err);
        win.loadURL('http://editor.casbin.org');
      }
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
