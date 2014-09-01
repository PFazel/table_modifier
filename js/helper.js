'use strict';
var Helper = (function() {

    // This app is small, so I decided not to separate model and controller and put them all in one file,
    // though functionalities of units are fairly separated.

    // Table selection model, main reference to understarnd which rows and cells are selected.
    var selectedCells = {};
    var selectedRows = {};

    // Logger object, singleton instance.
    var logger;

    // This function is incharge of setting up app for first time.
    var setup = function() {

        // Hold cursor position info
        var mouse = {
            x: 0,
            y: 0
        };

        // Setting up refrences
        var iframe = document.getElementById("output");
        var iframeTop = iframe.offsetTop / 2;
        var iframeLeft = iframe.offsetLeft / 2;
        var coords = document.getElementById('coords');
        var logContainer = document.getElementById('log');

        // Providing a proxy for dom access, in case of need for normalization
        var updateHTML = function(htmlStr, el) {
            el.innerHTML = htmlStr;
        }
        var getHTML = function(el){
            return el.innerHTML;
        }

        // Logs a message to specified element
        var logger = function(el){
            var currentMessage = getHTML(el)
            var log = function(message){
                var d = new Date()
                var time = d.getHours().toString() + ':' +
                 d.getMinutes().toString() + ':' +
                 d.getSeconds().toString();
                currentMessage += '<br/>' + time + ' - ' + message ;
                updateHTML(currentMessage, el);
            }
           return {
                log: log
           }
        }(logContainer)

        // Sets absolute position of an element in page
        var setAbsPosition = function(el, x, y) {
            el.style.top = y + 'px';
            el.style.left = x + 'px';
        }

        // Hides coodrination text and resets mouse object
        var hideCoords = function(e) {
            mouse.x = 0;
            mouse.y = 0;
            coords.style.display = 'none';
            updateHTML('', coords);
        }

        // Updates coordination text and mouse object based on current cursor position
        var updateCoordsPosition = function(e) {
            mouse.x = e.clientX || e.pageX;
            mouse.y = e.clientY || e.pageY;
            coords.style.display = 'inline';
            setAbsPosition(coords, iframeLeft + mouse.x, iframeTop + mouse.y);
            updateHTML('(' + mouse.x + ',' + mouse.y + ')', coords);
        }

        // Public API of setup function
        return {
            iframe: iframe,
            logger: logger,
            hideCoords: hideCoords,
            updateCoordsPosition: updateCoordsPosition
        }
    }

    // Creates a table with specified rows and columns and writes it to an iframe
    // Returns the newly added table
    var createTable = function(num_rows, num_cols, doc) {
        var theader = '<table id="hor-zebra" border="1">\n';
        var table;
        var tbody = '';
        var tfooter = '</table>';
        for (var i = 0; i < num_rows; i++) {
            tbody += '<tr>';
            for (var j = 0; j < num_cols; j++) {
                tbody += '<td>';
                tbody += 'Cell ' + i + ',' + j;
                tbody += '</td>'
            }
            tbody += '</tr>\n';
        }
        doc.open();
        doc.write('<!DOCTYPE html><html>' +
            '<head><meta charset="utf-8"/>' +
            '<meta http-quiv="Content-Type" content="text/html; charset=utf-8"/>' +
            '<title>Container Frame</title>' +
            '<link rel="stylesheet" type="text/css" href="css/table.css"/>' +
            '</head>' + '<body>' +
            theader + tbody + tfooter +
            '</body></html>');
        doc.close();
        logger.log('Creating a (' + num_rows + ' X ' + num_cols + ') table');
        return doc.getElementById('hor-zebra');
    }

    // Loops on an array and runs a callback function on each item
    var arrayEach = function(array, cb) {
        for (var i = 0; i < array.length; i++) {
            (function(i) {
                cb(array[i]);
            }(i));
        }
    }

    // Loops on an array in reverse order and runs a callback function on each item
    var arrayReverseEach = function(array, cb) {
        var reversedArray = [];
        for (var i = 0; i < array.length; i++) {
            reversedArray.unshift(array[i]);
        }
        for (var j = 0; j < reversedArray.length; j++) {
            (function(j) {
                cb(reversedArray[j]);
            }(j));
        }
    }

    // Handles cell clicks, adds the cell to cells selection model
    var onCellClick = function(cell, cells, rows) {
        cell.addEventListener('click', function(e) {
            var parentTr = this.parentElement;
            var key = (parentTr.rowIndex).toString() + (cell.cellIndex).toString();
            clearSelectionsMap();
            selectedCells[key] = cell;
            logger.log('Cell ('+ (parentTr.rowIndex).toString() + ',' + (cell.cellIndex).toString() +') selected');
            drawSelectionModel(cells, rows);
        })
    }

    // Handles cell double click, adds entire cells in arow to selection model
    var onCellDbClick = function(cell, cells, rows) {
        cell.addEventListener('dblclick', function(e) {
            var parentTr = this.parentElement;
            var selectedCellsiInRow = parentTr.children;
            var key;
            clearSelectionsMap();
            selectedRows[parentTr.rowIndex] = parentTr;
            logger.log('Row ('+ (parentTr.rowIndex).toString() +') selected');
            arrayEach(selectedCellsiInRow, function(item) {
                key = (parentTr.rowIndex).toString() + (item.cellIndex).toString();
                logger.log('Cell ('+ (parentTr.rowIndex).toString() + ',' + (item.cellIndex).toString() +') selected');
                selectedCells[key] = item;
            })
            drawSelectionModel(cells, rows);
        })
    }

    // Handles cell right clicks, disbles default right click behaviour on cells and toggles it's selection
    var onCellRightClick = function(cell, cells, rows) {
        cell.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            updateSelectionModel(cell);
            drawSelectionModel(cells, rows);
            return false;
        })
    }

    // Toggles the selection of a cell based on it's current condition
    var updateSelectionModel = function(cell) {
        var parentTr = cell.parentElement;
        var key = (parentTr.rowIndex).toString() + (cell.cellIndex).toString();
        if (cell.className.match('selected-cell') !== null) {
            logger.log('Cell ('+ (parentTr.rowIndex).toString() + ',' + (cell.cellIndex).toString() +') deselected');
            delete selectedRows[parentTr.rowIndex];
            delete selectedCells[key];
        } else {
            logger.log('Cell ('+ (parentTr.rowIndex).toString() + ',' + (cell.cellIndex).toString() +') selected');
            selectedCells[key] = cell;
        }
    }

    // Updates table view based on current selection model
    var drawSelectionModel = function(cells, rows) {
        arrayEach(cells, function(item) {
            var parentTr = item.parentElement;
            var key = (parentTr.rowIndex).toString() + (item.cellIndex).toString();
            if (typeof selectedCells[key] !== 'undefined') {
                item.className = 'selected-cell'
            } else {
                item.className = ''
            }
        })
        arrayEach(rows, function(item) {
            if (typeof selectedRows[item.rowIndex] !== 'undefined') {
                item.className = 'selected-row'
            } else {
                item.className = ''
            }
        })
    }

    // Clears selection model and updates UI
    var clearSelectionsMap = function() {
        var iframeDoc = Helper.iframeDoc;
        var table = iframeDoc.getElementById('hor-zebra');
        var rows = table.getElementsByTagName('tr');
        var cells = table.getElementsByTagName('td');
        logger.log('Selection model cleared.');
        selectedCells = {};
        selectedRows = {};
        arrayEach(rows, function(cell) {
            cell.className = '';
        })
        arrayEach(cells, function(cell) {
            cell.className = '';
        })
    }

    // Initialize basic events for table selecion
    var initTableEvents = function(table) {
        var cells = table.getElementsByTagName('td');
        var rows = table.getElementsByTagName('tr');
        arrayEach(cells, function(item) {
            onCellClick(item, cells, rows);
            onCellDbClick(item, cells, rows);
            onCellRightClick(item, cells, rows);
        });
    }

    // Deletes all selected cells and rows, clears selection model
    var deleteSelectedCells = function(table) {
        logger.log('All selected cells deleted.');
        var rows = table.getElementsByTagName('tr');
        var key;
        arrayReverseEach(rows, function(row) {
            var cellCount = 0;
            var rowCellCount = 0;
            var rowCells = row.getElementsByTagName('td');
            rowCellCount = rowCells.length;
            if (typeof selectedRows[row.rowIndex] !== 'undefined') {
                table.deleteRow(row.rowIndex);
            } else {
                arrayReverseEach(rowCells,function(cell) {
                    key = (row.rowIndex).toString() + cell.cellIndex.toString();
                    if (typeof selectedCells[key] !== 'undefined') {
                        cellCount += 1;
                        row.deleteCell(cell.cellIndex);
                    }
                })
                if (rowCellCount === cellCount) {
                    table.deleteRow(row.rowIndex);
               }
            }
        })
        clearSelectionsMap()
    }

    // Handles delete key event on key down
    var documentOnKeyDown = function(e, cb) {
        if (e.keyCode === 8) {
            e.preventDefault();
            if (typeof cb === 'function') {
                cb();
            }
            return false;
        }
    }

    // Public API of Helper module
    return {
        init: function() {
            var api = setup();
            var iframeDoc = api.iframe.contentWindow.document;
            var table = iframeDoc.getElementById('hor-zebra');
            Helper.iframeDoc = iframeDoc;
            logger = api.logger;

            // Listtens to mouse event for sake of showing coordination
            iframeDoc.addEventListener('mousemove', api.updateCoordsPosition, false);
            iframeDoc.addEventListener('mouseout', api.hideCoords, false);

            iframeDoc.addEventListener('keydown', function(e) {
                documentOnKeyDown(e, function(){
                    deleteSelectedCells(table)
                });
            }, false);
            document.addEventListener('keydown', documentOnKeyDown, false);
        },
        generateTable: function() {
            var num_rows = document.getElementById('rows').value;
            var num_cols = document.getElementById('cols').value;
            var table = createTable(num_rows, num_cols, Helper.iframeDoc);
            document.getElementById('main').style.display = 'block';
            Helper.init();
            initTableEvents(table);
        }
    }
})()
