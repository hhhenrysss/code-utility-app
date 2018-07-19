const {app, BrowserWindow} = require('electron');
let win;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1200,
        height: 600,
        'min-width': 400,
        'min-height': 300
    });
    win.loadFile('index.html');

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});
