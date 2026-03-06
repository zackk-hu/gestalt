const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let nextServer;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'public', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    autoHideMenuBar: true, // 隐藏菜单栏
    title: 'Gestalt - AI 提示词优化器'
  });

  // 在开发模式下，等待 Next.js 服务器启动
  if (isDev) {
    mainWindow.loadURL('http://localhost:7860');
    mainWindow.webContents.openDevTools();
  } else {
    // 生产模式：启动内置的 Next.js 服务器
    const nextPath = path.join(__dirname, 'node_modules', '.bin', 'next');
    
    nextServer = spawn('node', [nextPath, 'start', '-p', '7860'], {
      cwd: __dirname,
      shell: true
    });

    nextServer.stdout.on('data', (data) => {
      console.log(`Next.js: ${data}`);
    });

    nextServer.stderr.on('data', (data) => {
      console.error(`Next.js Error: ${data}`);
    });

    // 等待服务器启动后加载页面
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:7860');
    }, 3000);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (nextServer) {
    nextServer.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 退出时清理
app.on('before-quit', () => {
  if (nextServer) {
    nextServer.kill();
  }
});
