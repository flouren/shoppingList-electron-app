const electron = require('electron')
const url = require('url')
const path = require('path')
const { protocol } = require('electron')

const { app, BrowserWindow, Menu, ipcMain } = electron

// set env
process.env.NODE_ENV = 'production'

let mainWindow
let addWindow

// Listen for app to be ready
app.on('ready',function(){
    // create new window
    mainWindow = new BrowserWindow({
        icon:'shopping-cart.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    // load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }))
    // Quit app when closed
    mainWindow.on('closed',function(){
        app.quit()
    })

    // Build manu from tamplate
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)
})

//Handle create add window
function createAddWindow(){
    // create new window
    addWindow = new BrowserWindow({
        width:300,
        height:200,
        title:'Add Shopping List Item',
        //backgroundColor:'red',
        darkTheme:'true',
        icon:'shopping-cart.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    // load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }))
    // Garbage collection handle
    addWindow.on('close',function(){
        addWindow = null
    })
}


// Catch item:add
ipcMain.on('item:add',function(e,item){
    console.log(item);
    mainWindow.webContents.send('item:add',item)
    addWindow.close()
})

// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label:'Add Item',
                click(){
                    createAddWindow()
                }
            },
            {
                label:'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label:'Quit',
                accelerator:process.platform == 'darwin' ? 'Command+Q':'Ctrl+Q',
                click(){
                    app.quit()
                }
            }
        ]
    }
]

// If mac, add empty obj to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({})
}


// Add dev tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[
            {
                label:'Toggle DevTools',
                accelerator:process.platform == 'darwin' ? 'Command+I':'Ctrl+I',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role:'reload'
            }
        ]
    })
}