'use strict';

var app = require('electron').app;
const { BrowserWindow } = require('electron')
// var globalShortcut = require('global-shortcut');
var configuration = require('./configuration');
var marked = require('marked');
var fs = require('fs');
var remote = require('electron').remote;

var notesDirectory = __dirname + '/notes/';

var filesArray = [];

var mainWindow = null;
var settingsWindow = null;

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

app.on('ready', function() {

    try {
        fs.statSync(notesDirectory)
    } catch(ex) {
        fs.mkdirSync(notesDirectory);
    }

    var files = fs.readdirSync(notesDirectory);

    for(var i=0; i < files.length; i++) {
        var file = {
            filename: files[i],
            path: notesDirectory + files[i],
        };
        filesArray.push(file);
    }

    if (!configuration.readSettings('shortcutKeys')) {
        configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
    }

    let mainWindow = new BrowserWindow({
        frame: true,
        setMenuBarVisibility: false,
        setAutoHideMenuBar: false,
        height: 700,
        center: true,
        fullscreen: false,
        width: 1100
    });

    mainWindow.setFullScreen(false);
    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    //mainWindow.webContents.openDevTools()

    // mainWindow.webContents.on('did-finish-load', function() {
    //     mainWindow.webContents.printToPDF({}, function(error, data) {
    //         if (error) throw error
    //         fs.writeFile('/tmp/print.pdf', data, function(error) {
    //             if (error) throw error
    //                 console.log('Write PDF successfully.')
    //         })
    //     })
    // })

    //setGlobalShortcuts();
});

// function setGlobalShortcuts() {
//     globalShortcut.unregisterAll();

//     var shortcutKeysSetting = configuration.readSettings('shortcutKeys');
//     var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';

//     globalShortcut.register(shortcutPrefix + '1', function () {
//         mainWindow.webContents.send('global-shortcut', 0);
//     });
//     globalShortcut.register(shortcutPrefix + '2', function () {
//         mainWindow.webContents.send('global-shortcut', 1);
//     });
// }

// ipc.on('close-settings-window', function () {
//     if (settingsWindow) {
//         settingsWindow.close();
//     }
// });

// ipc.on('set-global-shortcuts', function () {
//     setGlobalShortcuts();
// });

exports.filesArray = function() {
    return filesArray;
}

exports.getFileContents = function(filename) {
    var result = null;
    try {
        result = fs.readFileSync(filename);
        return result;
    } catch( ex ) {
    }
    return null;
}

exports.saveFile = function(filePath, content) {
    var result = null;
    try {
        result = fs.writeFileSync(filePath, content);
        return true;
    } catch( ex ) {
    }
    return null;
}
