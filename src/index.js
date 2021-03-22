const { app, BrowserWindow, Menu, Tray, screen, ipcMain, shell, Notification } = require('electron');
const path = require('path');

app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath('exe')
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

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit DDEVManager', type: 'normal', click: app.quit}
    ])
    tray.setContextMenu(contextMenu)

    tray.on('click', createWindow);
}

app.whenReady().then(() => checkForUpdates())
const checkForUpdates = () => {
    const { net } = require('electron')
    let appVersion = app.getVersion()

    const request = net.request({
        method: 'GET',
        protocol: 'https:',
        hostname: 'api.github.com',
        port: 443,
        path: '/repos/CubE135/DDEVMaanager/releases/latest'
    })
    request.on('response', (response) => {
        if(!(response.statusCode === 200)) return;
        response.on('data', (chunk) => {
            let json = JSON.parse(chunk.toString())
            let version = json.tag_name.replace('v', '')
            if(version > appVersion){
                showUpdateNotification()
            }
        })
    })
    request.end()
}

const showUpdateNotification = () => {
    app.setAppUserModelId(app.name);
    const options = {
        title: 'Update Available!',
        body: 'Click to download the latest version of DDEVManager.',
        icon: __dirname + '/assets/img/icon.ico'
    }
    let notification = new Notification(options)
    notification.show()
    notification.on('click', (event, arg)=>{
        shell.openExternal("https://github.com/CubE135/DDEVMaanager/releases").then()
    })
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