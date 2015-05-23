var editor;
var menu;
var fileEntry;
var hasWriteAccess;

var gui = require("nw.gui");
var fs = require("fs");
var win = gui.Window.get();
var clipboard = gui.Clipboard.get();

function handleDocumentChange(title) {
    fileEntry = title;
    hasWriteAccess = true;
  	var mode = "javascript";
  	var modeName = "JavaScript";
    if (title) {
        title = title.match(/[^/]+$/)[0];
        document.getElementById("title").innerHTML = title;
        document.title = title;
        if (title.match(/.json$/)) {
          mode = {name: "javascript", json: true};
          modeName = "JavaScript (JSON)";
        } else if (title.match(/.html$/)) {
          mode = "htmlmixed";
          modeName = "HTML";
        } else if (title.match(/.css$/)) {
          mode = "css";
          modeName = "CSS";
        }
      } else {
        document.getElementById("title").innerHTML = "[no document loaded]";
    }
    editor.setOption("mode", mode);
    document.getElementById("mode").innerHTML = modeName;
}

function newFile() {
  fileEntry = null;
  hasWriteAccess = false;
  handleDocumentChange(null);
}

function setFile(theFileEntry, isWritable) {
  fileEntry = theFileEntry;
  hasWriteAccess = isWritable;
}

function readFileIntoEditor(theFileEntry) {
  fs.readFile(theFileEntry, function (err, data) {
    if (err) {
      console.log("Read failed: " + err);
    }

    handleDocumentChange(theFileEntry);
    editor.setValue(String(data));
  });
}

function writeEditorToFile(theFileEntry) {
  var str = editor.getValue();
  fs.writeFile(theFileEntry, editor.getValue(), function (err) {
    if (err) {
      console.log("Write failed: " + err);
      return;
    }

    handleDocumentChange(theFileEntry);
    console.log("Write completed.");
  });
}

var onChosenFileToOpen = function(theFileEntry) {
  setFile(theFileEntry, false);
  readFileIntoEditor(theFileEntry);
};

var onChosenFileToSave = function(theFileEntry) {
  setFile(theFileEntry, true);
  writeEditorToFile(theFileEntry);
};

function handleNewButton() {
  if (false) {
    newFile();
    editor.setValue("");
  } else {
    var x = window.screenX + 10;
    var y = window.screenY + 10;
    window.open('main.html', '_blank', 'screenX=' + x + ',screenY=' + y);
  }
}

function initContextMenu() {
  menu = new gui.Menu();
  menu.append(new gui.MenuItem({
    label: 'Copy',
    click: function() {
      clipboard.set(editor.getSelection());
    }
  }));
  menu.append(new gui.MenuItem({
    label: 'Cut',
    click: function() {
      clipboard.set(editor.getSelection());
      editor.replaceSelection('');
    }
  }));
  menu.append(new gui.MenuItem({
    label: 'Paste',
    click: function() {
      editor.replaceSelection(clipboard.get());
    }
  }));

  document.getElementById("editor").addEventListener('contextmenu',
    function(ev) { 
    ev.preventDefault();
    menu.popup(ev.x, ev.y);
    return false;
  });
}

function openFile() {
    $("#openFile").trigger("click");
};

function saveFile() {
  if (fileEntry && hasWriteAccess) {
    writeEditorToFile(fileEntry);
  } else {
    $("#saveFile").trigger("click");
  }
}

function saveFileAs() {
    $("#saveFile").trigger("click");
}

function newWindow() {
    var x = window.screenX + 10;
    var y = window.screenY + 10;
    window.open('main.html', '_blank', 'screenX=' + x + ',screenY=' + y);
};

function closeAllWindows() {
    gui.App.closeAllWindows();
};

function closeWindow() {
    win.close();
};

function initMenubar() {

    var nativeMenuBar = new gui.Menu({
        type: "menubar"
    });

    // Initialize Native Menus used by Mac
    var menuFileMain = new gui.Menu();
    var menuEditMain = new gui.Menu();
    var menuViewMain = new gui.Menu();
    var menuGotoMain = new gui.Menu();
    var menuHelpMain = new gui.Menu();

    //  Submenus for File Menu
    menuFileMain.append(new gui.MenuItem({
        label: "Open",
        key: "o",
        modifiers: "ctrl",
        click: function() {
            openFile()
        }
    }));
    menuFileMain.append(new gui.MenuItem({ 
        type: 'separator' 
    }));    
    menuFileMain.append(new gui.MenuItem({
        label: "Save",
        key: "s",
        modifiers: "ctrl",
        click: function() {
           saveFile()
        }
    }));
    menuFileMain.append(new gui.MenuItem({
        label: "Save As",
        key: "s",
        modifiers: "ctrl-shift",
        click: function() {
           saveFileAs()
        }
    }));
    menuFileMain.append(new gui.MenuItem({ 
        type: 'separator' 
    }));
    menuFileMain.append(new gui.MenuItem({
        label: "New Window",
        key: "n",
        modifiers: "ctrl-shift",
        click: function() {
            newWindow()
        }
    }));
    menuFileMain.append(new gui.MenuItem({
        label: "Close Window",
        key: "w",
        modifiers: "ctrl-shift",
        click: function() {
            closeWindow()
        }
    }));
    menuFileMain.append(new gui.MenuItem({ 
        type: 'separator' 
    })); 
    menuFileMain.append(new gui.MenuItem({
        label: "Exit",
        click: function() {
            closeAllWindows()
        }
    }));

    //  Submenus for Edit Menu
    menuEditMain.append(new gui.MenuItem({
        label: "Undo",
        key: "z",
        modifiers: "ctrl",
        click: function() {
            editor.undo()
        }
    }));
    menuEditMain.append(new gui.MenuItem({
        label: "Redo",
        key: "y",
        modifiers: "ctrl",
        click: function() {
            editor.redo()
        }
    }));
    menuEditMain.append(new gui.MenuItem({ 
        type: 'separator' 
    }));
    menuEditMain.append(new gui.MenuItem({
        label: "Copy",
        click: function() {
            NT.copyFunction();
        }
    }));    
    menuEditMain.append(new gui.MenuItem({
        label: "Cut",
        click: function() {
            NT.cutFunction();
        }
    }));
    menuEditMain.append(new gui.MenuItem({
        label: "Paste",
        click: function() {
            NT.pasteFunction();
        }
    }));
    menuEditMain.append(new gui.MenuItem({
        label: "Select All",
        click: function() {
            editor.execCommand("selectAll")
        }
    }));

    //  Submenus for View Menu
    menuViewMain.append(new gui.MenuItem({
        label: "Toggle Full Screen",
        click: function() {
            return;
        }
    }));
    menuViewMain.append(new gui.MenuItem({ 
        type: 'separator' 
    }));
    menuViewMain.append(new gui.MenuItem({
        label: "Zoom in",
        click: function() {
            return;
        }
    }));
    menuViewMain.append(new gui.MenuItem({
        label: "Zoom out",
        click: function() {
            return;
        }
    }));
    menuViewMain.append(new gui.MenuItem({ 
        type: 'separator' 
    }));
    menuViewMain.append(new gui.MenuItem({
        label: "Theme",
        click: function() {
            return;
        }
    }));

    // Submenus for Goto Menu
    menuGotoMain.append(new gui.MenuItem({
        label: "Back",
        click: function() {
            return;
        }
    }));
    menuGotoMain.append(new gui.MenuItem({
        label: "Forward",
        click: function() {
            return;
        }
    }));
    menuGotoMain.append(new gui.MenuItem({
        label: "Navigate History",
        click: function() {
            return;
        }
    }));
    menuGotoMain.append(new gui.MenuItem({ 
        type: 'separator' 
    }));
    menuGotoMain.append(new gui.MenuItem({
        label: "Go to File",
        click: function() {
            return;
        }
    }));

    //  Submenus for Help Menu
    menuHelpMain.append(new gui.MenuItem({
        label: "Documentation",
        click: function() {
            return;
        }
    }));
    menuHelpMain.append(new gui.MenuItem({ 
        type: 'separator' 
    }));
    menuHelpMain.append(new gui.MenuItem({
        label: "Join us on Twitter",
        click: function() {
            return;
        }
    }));
    menuHelpMain.append(new gui.MenuItem({
        label: "Feature Reqest",
        click: function() {
            return;
        }
    }));
    menuHelpMain.append(new gui.MenuItem({
        label: "Report Issues",
        click: function() {
            return;
        }
    }));
    menuHelpMain.append(new gui.MenuItem({ 
        type: 'separator' 
    }));
    menuHelpMain.append(new gui.MenuItem({
        label: "Check for Updates",
        click: function() {
            return;
        }
    }));
    menuHelpMain.append(new gui.MenuItem({
        label: "Changelog",
        click: function() {
            return
        }
    }));
    menuHelpMain.append(new gui.MenuItem({
        label: "About",
        click: function() {
            return;
        }
    }));

    // Append Menus to menubar
    nativeMenuBar.append(new gui.MenuItem({
        label: "File",
        submenu: menuFileMain
    }));
    nativeMenuBar.append(new gui.MenuItem({
        label: "Edit",
        submenu: menuEditMain
    }));
    nativeMenuBar.append(new gui.MenuItem({
        label: "View",
        submenu: menuViewMain
    }));
    nativeMenuBar.append(new gui.MenuItem({
        label: "Goto",
        submenu: menuGotoMain
    }));
    nativeMenuBar.append(new gui.MenuItem({
        label: "Help",
        submenu: menuHelpMain
    }));

    // Adding the menubar to the window's menu
    win.menu = nativeMenuBar;
};

onload = function() {
    initContextMenu();
    initMenubar()

    $("#saveFile").change(function(evt) {
        onChosenFileToSave($(this).val());
    });
    $("#openFile").change(function(evt) {
        onChosenFileToOpen($(this).val());
    });

    editor = CodeMirror(
        document.getElementById("editor"),{
            mode: {name: "javascript", json: true },
            lineNumbers: true,
            lineWrapping: true,
            indentUnit: 4,
            tabSize: 4,
            autofocus: true,
            theme: "ambiance",
            extraKeys: {
                "Cmd-S": function(instance) { handleSaveButton() },
                "Ctrl-S": function(instance) { handleSaveButton() },
            }
        }
    );

  newFile();
  onresize();

  win.show();
};

onresize = function() {
  var container = document.getElementById('editor');
  var containerWidth = container.offsetWidth;
  var containerHeight = container.offsetHeight;

  var scrollerElement = editor.getScrollerElement();
  scrollerElement.style.width = containerWidth + 'px';
  scrollerElement.style.height = containerHeight + 'px';

  editor.refresh();
}
