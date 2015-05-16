//
// Program:         Fun Editor
//
// Description:     This is a basic editor built using NW.js.
//          This is more of a project to learn how to use
//          NW.js, but I am finding that I really like
//          the editor!
//
// Author:      Richard Guay (raguay@customct.com)
// License:         MIT
//
 
//
// Class:       Nate
//
// Description:     This class contains the information and functionality
//          of the Fun Editor. There should be only one instance
//          of this class per editor.
//
// Class Variables:
//                  editor      Keeps the Editor object
//                  menu        keeps the menu object for the pop-up
//                              menu.
//                  menuEdit        Edit menu for the popup menu
//                  menuEditMain    The Edit menu for the main menu
//                  menuFile        File menu for the popup menu
//                  menuFileMain    File menu for the main menu
//                  nativeMenuBar   The menu bar for OSX Main menu
//                  hasWriteAccess  boolean for if the file is
//                                  writable or not.
//                  origFileName    Last file name opened.
//                  watch       The node-watch library object.
//                  osenv       The osenv library object.
//                  gui             The NW.js gui library
//                              object.
//                  fs          The fs library object.
//                  clipboard       The clipboard library object.
//
function Nate() {}
 
Nate.prototype.filesOpened = 0;
Nate.prototype.saving = false;
Nate.prototype.editor = null;
Nate.prototype.menu = null;
Nate.prototype.menuEdit = null;
Nate.prototype.menuFile = null;
Nate.prototype.menuEditMain = null;
Nate.prototype.menuFileMain = null;
Nate.prototype.nativeMenuBar = null;
Nate.prototype.fileEntry = null;
Nate.prototype.hasWriteAccess = false;
Nate.prototype.origFileName = "";
Nate.prototype.theme = {};
Nate.prototype.lastCursor = { line: 0, col: 0 };
Nate.prototype.watch = require("node-watch");
Nate.prototype.gui = require("nw.gui");
Nate.prototype.fs = require("fs");
Nate.prototype.osenv = require("osenv");
Nate.prototype.os = require("os");
 
var NT = new Nate();
 
Nate.prototype.clipboard = NT.gui.Clipboard.get();
Nate.prototype.win = NT.gui.Window.get();
 
//
// Function:    handleDocumentChange
//
// Description:     This function is called whenever the document
//          is changed. This function will get the title set,
//          remove the old document name from the window
//          list, set the syntax highlighting based on the
//          file extension, and update the status line.
//
// Inputs:
//          title   Title of the new document
//
Nate.prototype.handleDocumentChange = function(title) {
     //
     // Setup the default syntax highlighting mode.
     //
     var mode = "ace/mode/javascript";
     var modeName = "JavaScript";
 
     //
     // Set the new file name. If the title is blank, reflect that for
     // setting a new one later.
     //
     this.fileEntry = title;
 
     //
     // Set the syntax highlighting based on the file ending.
     //
     if (title) {
        //
        // Set up file watching with node-watch. The file being edited is
        // watched for changes. If the file changes, then reload the file
        // into the editor.
        //
        this.watch(this.fileEntry, function() {
            //
            // The file changed. Load it into the editor. Needs implemented:
            // ask the user if they want the file to be reloaded.
            //
            if(! NT.saving ) {
                    NT.readFileIntoEditor(NT.fileEntry);
            }
        });
 
        //
        // If there is a title, then setup everything by that title.
        // The title will be the file name.
        //
        if(this.os.platform()  == "win32") {
            title = title.match(/[^\\]+$/)[0];
        } else {
            title = title.match(/[^/]+$/)[0];
        }
        if (this.origFileName.indexOf(title) == -1) {
            //
            // Remove whatever the old file was loaded and put in
            // the new file.
            //
            this.origFileName = title;
        }
 
        //
        // Check for OS permissions for writing. NOTE: Not implemented.
        //
        this.hasWriteAccess = true;
 
        //
        // Set the document's title to the file name.
        //
        document.getElementById("title").innerHTML = title;
        document.title = title;
 
        //
        // Set the syntax highlighting mode based on extension of the file.
        //
        if (title.match(/\.js$/)) {
            mode = "ace/mode/javascript";
            modeName = "JavaScript";
        } else if (title.match(/\.html$/)) {
            mode = "ace/mode/html";
            modeName = "HTML";
        } else if (title.match(/\.css$/)) {
            mode = "ace/mode/css";
            modeName = "CSS";
        } else if (title.match(/\.less$/)) {
            mode = "ace/mode/less";
            modeName = "LESS";
        }  else if (title.match(/\.md$/)) {
            mode = "ace/mode/markdown";
            modeName = "Markdown";
        } else if (title.match(/\.ft$/)) {
            mode = "ace/mode/markdown";
            modeName = "FoldingText";
        } else if (title.match(/\.markdown$/)) {
            mode = "ace/mode/markdown";
            modeName = "Markdown";
        } else if (title.match(/\.php$/)) {
            mode = "ace/mode/php";
            modeName = "PHP";
        }
    } else {
        //
        // Setting an empty document. Leave syntax highlighting as the last
        // file.
        //
        document.getElementById("title").innerHTML = "[no document loaded]";
        this.origFileName = "";
    }
 
    //
    // Tell the Editor and setup the status bar with the syntax highlight mode.
    //
    this.editor.getSession().setMode(mode);
    document.getElementById("mode").innerHTML = modeName;
};
 
//
// Function:        setCursorLast
//
// Description:     Set the cursor to the last stored state.
//
Nate.prototype.setCursorLast = function() {
    this.editor.moveCursorTo(this.lastCursor.line, this.lastCursor.col);
}
 
//
// Function:        newFile
//
// Description:     This function is called to set the global
//          variables properly for a new empty file.
//
// Inputs:
//
Nate.prototype.newFile = function() {
    this.fileEntry = null;
    this.hasWriteAccess = false;
    this.handleDocumentChange(null);
    this.editor.setValue("");
};
 
//
// Function:    readFileIntoEditor
//
// Description:     This function handles the reading of the file
//          contents into the editor. If reading fails, a
//          log entry is created.
//
// Inputs:
//          theFileEntry    The path and file name
//
Nate.prototype.readFileIntoEditor = function(theFileEntry) {
    this.fs.readFile(theFileEntry, function(err, data) {
        if (err) {
            console.log("Error Reading file.");
        }
 
        //
        // Set the file properties.
        //
        NT.handleDocumentChange(theFileEntry);
 
        //
        // Set the file contents.
        //
        NT.editor.setValue(String(data));
 
        //
        // Remove the selection.
        //
        NT.editor.session.selection.clearSelection();
 
        //
        // Put the cursor to the last know position.
        //
        NT.setCursorLast();
    });
};
 
//
// Function:    writeEditorToFile
//
// Description:     This function takes what is in the editor
//          and writes it out to the file.
//
// Inputs:
//          theFileEntry    File to write the contents to.
//
Nate.prototype.writeEditorToFile = function(theFileEntry) {
    var str = this.editor.getValue();
    this.fs.writeFile(theFileEntry, str, function(err) {
        if (err) {
            console.log("Error Writing file.");
            return;
        }
    });
};
 
//
// Function:    copyFunction
//
// Description:     This function takes the current selection and copies it
//          to the clipboard.
//
Nate.prototype.copyFunction = function() {
    this.clipboard.set(this.editor.getCopyText());
};
 
//
// Function:    cutFunction
//
// Description:     This function cuts out the current selection and copies it
//          to the clipboard.
//
Nate.prototype.cutFunction = function() {
    this.clipboard.set(this.editor.getCopyText());
    this.editor.session.replace(this.editor.selection.getRange(),"");
};
 
//
// Function:    pasteFunction
//
// Description:     This function takes the clipboard and pastes it to the
//                  current location.
//
Nate.prototype.pasteFunction = function() {
    this.editor.session.replace(this.editor.selection.getRange(), this.clipboard.get());
};
 
//
// Function:    openFile
//
// Description:     This function opens the select a file dialog for opening
//          into the editor.
//
Nate.prototype.openFile = function() {
    $("#openFile").trigger("click");
};
 
//
// Function:    saveFile
//
// Description:     This function saves to the currently open file or
//          opens the save file dialog.
//
Nate.prototype.saveFile = function() {
    this.saving = true;
    if (this.fileEntry && this.hasWriteAccess) {
        this.writeEditorToFile(this.fileEntry);
    } else {
        $("#saveFile").trigger("click");
    }
    this.saving = false;
};
 
//
// Function:    initMenus
//
// Description: This function setups the right click menu and system used
//          in the editor.
//
// Inputs:
//
Nate.prototype.initMenus = function() {
    this.menu = new this.gui.Menu();
    this.menuFile = new this.gui.Menu();
    this.menuEdit = new this.gui.Menu();
    this.menuFile.append(new this.gui.MenuItem({
        label: "New",
        click: function() {
            NT.newFile();
        }
    }));
    this.menuFile.append(new this.gui.MenuItem({
        label: "Open",
        click: function() {
            NT.openFile();
        }
    }));
    this.menuFile.append(new this.gui.MenuItem({
        label: "Save",
        click: function() {
            NT.saveFile();
        }
    }));
 
    this.menuEdit.append(new this.gui.MenuItem({
        label: "Copy",
        click: function() {
            NT.copyFunction();
        }
    }));
     this.menuEdit.append(new this.gui.MenuItem({
          label: "Cut",
          click: function() {
            NT.cutFunction();
          }
     }));
     this.menuEdit.append(new this.gui.MenuItem({
          label: "Paste",
          click: function() {
            NT.pasteFunction();
          }
     }));
 
     this.menuFileMain = new this.gui.Menu();
     this.menuEditMain = new this.gui.Menu();
     this.menuFileMain.append(new this.gui.MenuItem({
          label: "New",
          click: function() {
            NT.newFile();
          }
     }));
     this.menuFileMain.append(new this.gui.MenuItem({
          label: "Open",
          click: function() {
            NT.openFile();
          }
     }));
     this.menuFileMain.append(new this.gui.MenuItem({
        label: "Save",
        click: function() {
            NT.saveFile();
        }
     }));
 
     this.menuEditMain.append(new this.gui.MenuItem({
        label: "Copy",
        click: function() {
            NT.copyFunction();
        }
     }));
     this.menuEditMain.append(new this.gui.MenuItem({
        label: "Cut",
        click: function() {
            NT.cutFunction();
        }
     }));
     this.menuEditMain.append(new this.gui.MenuItem({
        label: "Paste",
        click: function() {
            NT.pasteFunction();
        }
     }));
 
     this.menu.append(new this.gui.MenuItem({
        label: "File",
        submenu: NT.menuFile
     }));
 
     this.menu.append(new this.gui.MenuItem({
        label: "Edit",
        submenu: NT.menuEdit
     }));
 
     //
     // Create the main Mac menu also.
     //
     this.nativeMenuBar = new this.gui.Menu({
        type: "menubar"
     });
 
     if(this.os.platform()  == "darwin") {
         this.nativeMenuBar.createMacBuiltin("Fun Editor", {
            hideEdit: true,
            hideWindow: true
         });
    }
 
     this.nativeMenuBar.append(new this.gui.MenuItem({
        label: "File",
        submenu: NT.menuFileMain
     }));
 
     this.nativeMenuBar.append(new this.gui.MenuItem({
        label: "Edit",
        submenu: NT.menuEditMain
     }));
     this.win.menu = this.nativeMenuBar;
 
    //
    // Add the menu to the contextmenu event listener.
    //
    document.getElementById("editor").addEventListener("contextmenu",
        function(ev) {
            ev.preventDefault();
            NT.menu.popup(ev.x, ev.y);
            return false;
        }
    );
};
 
//
// Function:        onChosenFileToOpen
//
// Description:     This function is called whenever a open
//          file dialog is closed with a file selection.
//          This is an automatically made function in
//          NW.js that needs to be set by your app.
//
// Inputs:
//          theFileEntry        The path to the file selected.
//
onChosenFileToOpen = function(theFileEntry) {
    NT.readFileIntoEditor(theFileEntry);
};
 
//
// Function:        onChosenFileToSave
//
// Description:     When a file is selected to save into, this
//          function is called. It is originally set by
//          NW.js.
//
// Inputs:
//          theFileEntry        The path to the file selected.
//
onChosenFileToSave = function(theFileEntry) {
     NT.writeEditorToFile(theFileEntry);
};
 
//
// Function:        onload
//
// Description:     This function is setup by NW.js to be
//                  called when the page representing the application
//                  is loaded. The application overrides this by
//                  assigning it's own function.
//
//                  Here, we initialize everything needed for the
//                  Editor. It also loads the initial document for
//                  the editor, any plugins, and theme.
//
// Inputs:
//
onload = function() {
 
     //
     // Initialize the context menu.
     //
     NT.initMenus();
 
     //
     // Set the change function for saveFile and openFile.
     //
     $("#saveFile").change(function(evt) {
        onChosenFileToSave($(this).val());
    });
    $("#openFile").change(function(evt) {
        onChosenFileToOpen($(this).val());
    });
 
    NT.editor = ace.edit("editor");
    NT.editor.$blockScrolling = Infinity;
    NT.editor.setTheme("ace/theme/solarized_dark");
    NT.editor.getSession().setMode("ace/mode/javascript");
    NT.editor.setKeyboardHandler("ace/keyboard/vim");
    NT.editor.setOption("enableEmmet", true);
    NT.editor.setOption("selectionStyle","text");
    NT.editor.setOption("highlightActiveLine",true);
    NT.editor.setOption("cursorStyle","slim");
    NT.editor.setOption("autoScrollEditorIntoView",true);
    NT.editor.setOption("tabSize",4);
    NT.editor.setOption("enableSnippets",true);
    NT.editor.setOption("spellcheck",true);
    NT.editor.setOption("wrap",true);
    NT.editor.setOption("enableBasicAutocompletion",true);
    NT.editor.setOption("enableLiveAutocompletion",false);
    NT.editor.commands.addCommand({
        name: "myCopy",
        bindKey: {win: "Ctrl-C",  mac: "Command-C"},
        exec: function(editor) {
            NT.copyFunction();
        },
        readOnly: false
    });
    NT.editor.commands.addCommand({
        name: "myPaste",
        bindKey: {win: "Ctrl-V",  mac: "Command-V"},
        exec: function(editor) {
            NT.pasteFunction();
        },
        readOnly: false
    });
    NT.editor.commands.addCommand({
        name: "myCut",
        bindKey: {win: "Ctrl-X",  mac: "Command-X"},
        exec: function(editor) {
            NT.cutFunction();
        },
        readOnly: false
    });
    NT.editor.commands.addCommand({
        name: "mySave",
        bindKey: {win: "Ctrl-S",  mac: "Command-S"},
        exec: function(editor) {
            NT.saveFile();
        },
        readOnly: false
    });
 
    //
    // Tie into the Vim mode save function. NT one took some digging to find!
    //
    NT.editor.state.cm.save = function() {
        NT.saveFile();
    }
 
    //
    // Setup on events listeners. The first one is listen for cursor
    // movements to update the position in the file in the status line.
    // Next, setup the listener for Vim mode changing to update the
    // status line. Lastly, run function on window closing to remove
    // the current file from the open file list.
    //
    NT.editor.on("changeStatus", function() {
        //
        // Get the current cursor to set the row and column.
        //
        var cursor = NT.editor.selection.lead;
        document.getElementById("linenum").innerHTML = cursor.row + 1;
        document.getElementById("colnum").innerHTML = cursor.column + 1;
 
            //
                // Save a copy of the cursor location.
                //
                NT.lastCursor.line = cursor.row;
                NT.lastCursor.col = cursor.column;
 
        //
        // Get the text mode to set the Normal, Visual, or Insert vim
        // modes in the status line.
        //
        var mode = NT.editor.keyBinding.getStatusText(editor);
        if (mode == "") {
            document.getElementById("editMode").innerHTML = "Normal";
        } else if (mode == "VISUAL") {
            document.getElementById("editMode").innerHTML = "Visual";
        } else if (mode == "INSERT") {
            document.getElementById("editMode").innerHTML = "Insert";
        }
    });
 
    //
    // Capture the Ace editor's copy and paste signals to get
    // or put to the system clipboard.
    //
    NT.editor.on("copy",function(text) {
        NT.clipboard.set(text);
    });
    NT.editor.on("paste", function(e) {
        e.text = NT.clipboard.get();
    });
 
    //
    // Capture the window close and make
    // sure the file has been saved.
    //
     NT.win.on("close", function() {
        //
        // Make sure the contents are saved.
        //
        if (this.fileEntry && this.hasWriteAccess) {
            NT.saveFile();
         }
 
        //
        // Close the program.
        //
        this.close(true);
     });
 
     //
     // Setup for having a new empty file loaded.
     //
     NT.newFile();
     onresize();
 
     //
     // Show the program and set the focus (focus does not work!).
     //
     NT.win.show();
     NT.win.focus();
};
 
//
// Function:        onresize
//
// Description:     Another NW.js function that is called every time
//          the application is resized.
//
// Inputs:
//
onresize = function() {
};