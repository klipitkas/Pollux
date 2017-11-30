'use strict';

var marked = require('marked');
var noteContent = document.getElementById('note-content');
var notePreview = document.getElementById('note-preview');
var sidebarItems = document.getElementsByClassName('sidebar__item');
const mainProc = require('electron').remote.require('./main.js')
const filesArray = mainProc.filesArray();

noteContent.addEventListener('input', function() {
    notePreview.innerHTML = marked(noteContent.value);
    var selectedSidebarItem = document.getElementsByClassName('sidebar__item selected')[0];
    var filePath = selectedSidebarItem.childNodes[0].getAttribute('data-filepath');
    mainProc.saveFile(filePath, noteContent.value);
});

function sidebarItemClick() {
    var sidebarItems = document.getElementsByClassName('sidebar__item');
    for(var i=0; i < sidebarItems.length; i++) {
        sidebarItems[i].className = sidebarItems[i].className.replace(' selected', '');
    }
    var path = this.childNodes[0].getAttribute('data-filepath');
    if ( path != null ) {
        noteContent.value = mainProc.getFileContents(path);
        notePreview.innerHTML = marked(noteContent.value);
    }
    this.className += ' selected';
}

var firstSidebarItem = document.getElementsByClassName('sidebar__item')[0];
var sidebar = document.getElementsByClassName('sidebar')[0];

for (var i=0; i < filesArray.length; i++) {
    var filename = filesArray[i].filename;
    var filePath = filesArray[i].path;

    var newSidebarItem = firstSidebarItem.cloneNode(true);
    newSidebarItem.innerHTML = "<a class='link' href='#' data-filepath='" +
        filePath + "'>" + filename + "</a><p class='description'>123</p>";
    sidebar.appendChild(newSidebarItem);
}

sidebarItems = document.getElementsByClassName('sidebar__item');

for(var i=0; i < sidebarItems.length; i++) {
    sidebarItems[i].addEventListener('click', sidebarItemClick);
}

firstSidebarItem.remove();

const remote = require('electron').remote;

document.getElementById("min-btn").addEventListener("click", function (e) {
   var window = remote.getCurrentWindow();
   window.minimize();
});

document.getElementById("max-btn").addEventListener("click", function (e) {
   var window = remote.getCurrentWindow();
   if (!window.isMaximized()) {
       window.maximize();
   } else {
       window.unmaximize();
   }
});

document.getElementById("close-btn").addEventListener("click", function (e) {
   var window = remote.getCurrentWindow();
   window.close();
});