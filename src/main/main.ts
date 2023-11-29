/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  safeStorage,
  IpcMainEvent,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import { performance } from 'perf_hooks';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import Channels from '../common/channels';

const Store = require('electron-store');
const io = require('socket.io')();
import log from 'electron-log/main';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

log.initialize({ preload: true });
// log.info('Log from the main process');

const start = performance.now();

const SDK_SOCKET_PORT = process.env.SDK_SOCKET_PORT || 3001;

const store = new Store();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let workerWindow: BrowserWindow | null = null;

const appdev_server = io.listen(SDK_SOCKET_PORT);
appdev_server.on('connection', (socket) => {
  console.log('A user connected');

  async function onClientRegistered(event: IpcMainEvent, registered: boolean) {
    console.log('Client registered: ', registered);
    socket.emit('registered', registered);
  }
  ipcMain.on(Channels.CLIENT_REGISTERED, onClientRegistered)

  async function onJobResultsReceived(
    event: IpcMainEvent,
    status: Number,
    response: String,
    error: String,
    taskId: String,
    transactionId: String
  ) {
    console.log('Sending job results to client... ', status, response, error, taskId, transactionId)
    socket.emit('job_results_received', status, response, error, taskId, transactionId);
  }
  ipcMain.on(Channels.JOB_RESULTS_RECEIVED, onJobResultsReceived)

  socket.on('offload', async (jobJson: string) => {
    console.log('Received job...', jobJson);
    try {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      mainWindow.webContents.send(Channels.OFFLOAD_JOB, jobJson);
      socket.emit('offloaded', null, 'success');
    } catch (error) {
      socket.emit('offloaded', error, null);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.webContents.send(Channels.DEREGISTER_CLIENT);

    ipcMain.removeAllListeners(Channels.CLIENT_REGISTERED);
    ipcMain.removeListener(Channels.JOB_RESULTS_RECEIVED, onJobResultsReceived);
  });

  try {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.webContents.send(Channels.REGISTER_CLIENT);
  } catch (error) {
    console.log(error);
  }
});

function showLoginWindow() {
  // window.loadURL('https://www.your-site.com/login')
  if (mainWindow) {
    shell.openExternal('localhost:1212/login');
    // mainWindow
    //   .loadFile('src/main/login.html') // For testing purposes only
    //   .then(() => {
    //     if (mainWindow) {
    //       mainWindow.show();
    //       console.log("mainwindowshowdone")
    //     }
    //   });
  }
}
ipcMain.handle(Channels.OPEN_LINK_PLEASE, () => {
  shell.openExternal('http://localhost:3000/');
});

ipcMain.on(Channels.OPEN_WINDOW, (event) => {
  showLoginWindow();
});

ipcMain.on(Channels.STORE_GET, async (event, key) => {
  try {
    const encryptedKey = store.get(key);

    if (encryptedKey !== undefined) {
      const decryptedKey = safeStorage.decryptString(
        Buffer.from(encryptedKey, 'latin1')
      );
      event.returnValue = decryptedKey;
    } else {
      // Handle the case when the key is undefined (not found)
      event.returnValue = null; // Or another appropriate default value
    }
  } catch (error) {
    // Handle any errors that may occur during the decryption process
    console.error('Error while getting value:', error);
    event.returnValue = null; // Or another appropriate default value
  }
});

ipcMain.on(Channels.STORE_SET, async (event, key, val) => {
  const buffer = safeStorage.encryptString(val);
  store.set(key, buffer.toString('latin1'));
});

ipcMain.on(Channels.JOB_RESULTS_RECEIVED, async (event, id, result) => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.webContents.send(Channels.JOB_RESULTS_RECEIVED, id, result);
});

ipcMain.on(Channels.JOB_RECEIVED, async (event, id, result) => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.webContents.send(Channels.JOB_RECEIVED, id, result);
});

ipcMain.on(Channels.START_CONSUMER, async (event, queueName) => {
  if (!workerWindow) {
    throw new Error('"workerWindow" is not defined');
  }
  workerWindow.webContents.send(Channels.START_CONSUMER, queueName);
});

ipcMain.on(Channels.STOP_CONSUMER, async (event, queueName) => {
  if (!workerWindow) {
    throw new Error('"workerWindow" is not defined');
  }
  workerWindow.webContents.send(Channels.STOP_CONSUMER, queueName);
});

ipcMain.on(Channels.APP_CLOSE_CONFIRMED, () => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.destroy();
});

ipcMain.on(Channels.APP_RELOAD_CONFIRMED, () => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.reload();
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')({ showDevTools: false });
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions: string[] = [];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1440,
    height: 900,
    icon: getAssetPath('logo-m.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webSecurity: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  workerWindow = new BrowserWindow({
    show: true,
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  workerWindow.loadFile('src/worker_renderer/worker.html');

  mainWindow.once('focus', () => {
    const focusMs = performance.now() - start;
    console.log(`Window created in ${focusMs} ms`);
  });

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    const readyToShowMs = performance.now() - start;
    console.log(`Window ready to show in ${readyToShowMs} ms`);
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('close', (e) => {
    log.info('mainWindow close');
    e.preventDefault();
    mainWindow?.webContents.send('app-close-initiated');
  });
  mainWindow.on('closed', () => {
    log.info('mainWindow closed');
    mainWindow = null;
  });
  mainWindow.webContents.on('will-navigate', (event) => {
    log.info('mainWindow did-start-navigation');
    event.preventDefault();
    mainWindow?.webContents.send('app-reload-initiated');
  });
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  new AppUpdater();
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    const appReadyMs = performance.now() - start;
    console.log(`App ready in ${appReadyMs} ms`);
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
