var gui = require('nw.gui');
var win = gui.Window.get();

initMenus = function() {

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
        label: "New File",
        key: "n",
        modifiers: "ctrl",
        click: function() {
            
        }
    }));
    menuFileMain.append(new gui.MenuItem({
        label: "Open",
        key: "o",
        modifiers: "ctrl",
        click: function() {
            
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
           
        }
    }));
    menuFileMain.append(new gui.MenuItem({
        label: "Save As",
        key: "s",
        modifiers: "ctrl-shift",
        click: function() {
           
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
            
        }
    }));
    menuFileMain.append(new gui.MenuItem({
        label: "Close Window",
        key: "w",
        modifiers: "ctrl-shift",
        click: function() {
            
        }
    }));
    menuFileMain.append(new gui.MenuItem({ 
        type: 'separator' 
    })); 
    menuFileMain.append(new gui.MenuItem({
        label: "Exit",
        click: function() {
            
        }
    }));

    //  Submenus for Edit Menu
    menuEditMain.append(new gui.MenuItem({
        label: "Undo",
        click: function() {
            return;
        }
    }));
    menuEditMain.append(new gui.MenuItem({
        label: "Redo",
        click: function() {
            return;
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
            return;
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
	initMenus()
	win.maximize();
  	win.show();
};