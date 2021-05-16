const electron = require('electron')
const url = require('url')
const path = require('path')
const { protocol } = require('electron')

const { app, BrowserWindow } = electron

let mainWindow

// Listen for app to be ready
app.on('ready',function(){
    // create new window
    mainWindow = new BrowserWindow({})

    // load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }))
})

// Create menu template
const mainMenuTemplate = [
    
]