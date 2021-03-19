const { app, BrowserWindow, Tray, screen, ipcMain, shell } = require('electron');
const path = require('path');

app.setLoginItemSettings({
    openAtLogin: true
})

if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow = null;
const createWindow = () => {
    let cursorPosition = screen.getCursorScreenPoint();
    let screenSize = screen.getPrimaryDisplay().workAreaSize;
    let windowWidth = 350;
    let windowHeight = 600;
    if (mainWindow){
        if (!mainWindow.isVisible()){
            mainWindow.setPosition(cursorPosition.x - windowWidth/2, screenSize.height - windowHeight);
            mainWindow.show();
        }
        return;
    }
    mainWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: cursorPosition.x - windowWidth/2,
        y: screenSize.height - windowHeight,
        icon: __dirname + '/assets/img/icon.ico',
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Hide the Window on Blur
    mainWindow.on('blur', function () {
        mainWindow.hide();
    });
};

let tray = null;
const createTray = () => {
    let iconPath = path.join(__dirname, 'assets/img/icon.ico');
    tray = new Tray(iconPath);
    tray.setToolTip('DDEVManager');

    tray.on('click', createWindow);
}

app.on('ready', createTray);

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

ipcMain.on('open-folder', (event, arg) => {
    mainWindow.hide();
    shell.openPath(arg).then();
})