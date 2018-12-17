// Canvas DOM object and drawing context
var c, ctx;

// Width and height of the grid (in cells)
var width = 80;
var height = 25;

// Size of each cell (set automatically)
var cellWidth;
var cellHeight;

var backgroundColor = '#282828'; // Color of inactive cells
var foregroundColor = '#282828'; // Color of active cells
var gridColor = '#3c3836'; // Color of dividing lines
var textColor = '#ebdbb2'; // Color of grid cell text
var cursorColor = '#a89984';

var offset = 2;

// Array holding grid data
var grid = [];

var cursorPos = 0;

/**
 * Automatically set the optimum canvas size based on window width and height
 */
function setCanvasSize() {
    // ratio = width / height;
    // if (window.innerWidth / width < window.innerHeight / height) {
    //     c.width = window.innerWidth * 1;
    //     c.height = c.width / width * height;
    // } else {
    //     c.height = window.innerHeight * 1;
    //     c.width = c.height / height * width;
    // }
    c.width = window.innerWidth * 0.98;
    cellWidth = c.width / width;
    cellHeight = cellWidth * 1.62;
    c.height = height * cellHeight;
}

window.onload = function() {

    // Populate grid with 0s
    numCells = width * height;
    grid = Array(numCells);
    for (var i = 0; i < grid.length; i++) {
        grid[i] = null;
    }
    // grid = Array.apply(null, Array(numCells)).map(Number.prototype.valueOf, 0);

    document.addEventListener('keydown', function(e) {
        var e = window.event || e; // Browser compatibility
        handleKeyPress(e);
    });

    document.addEventListener('click', function(e) {
        var e = window.event || e; // Browser compatibility
        index = coordsToIndex(mouseToGrid(getMousePos(e)));
        cursorPos = index;
        // grid[index] = (grid[index] == 1 ? 0 : 1);
    });

    document.addEventListener('copy', function(e) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', convertToText());
    });

    c = document.getElementById('canvas');
    ctx = c.getContext('2d');

    setCanvasSize();

    window.addEventListener("resize", setCanvasSize, false);

    requestAnimationFrame(draw);
}

function print(c) {
    grid[cursorPos] = c;
    cursorPos++;
}

/**
 * Draw the grid.
 * Runs once every frame.
 */
function draw() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.strokeStyle = gridColor;
    ctx.beginPath();
    for (var x = 0; x < width; x++) {
        ctx.moveTo(x * cellWidth, 0);
        ctx.lineTo(x * cellWidth, c.height);
    }
    for (var y = 0; y < height; y++) {
        ctx.moveTo(0, y * cellHeight);
        ctx.lineTo(c.width, y * cellHeight);
    }
    ctx.stroke();

    for (var i = 0; i < grid.length; i++) {
        drawCell(i, grid[i]);
    }
    drawCursor();
    requestAnimationFrame(draw);
}

function drawCursor() {
    ctx.fillStyle = cursorColor;
    var x = cursorPos % width * cellWidth;
    var y = (cursorPos - cursorPos % width) / width * cellHeight;
    ctx.fillRect(x, y, cellWidth, cellHeight);
}

/**
 * Draw each individual cell
 */
function drawCell(pos, val) {
    if (val != null) {
        var x = pos % width;
        var y = (pos - pos % width) / width;

        var piece_x = x * cellWidth;
        var piece_y = y * cellHeight;

        ctx.fillStyle = foregroundColor;
        ctx.fillRect(piece_x, piece_y, cellWidth, cellHeight);

        var text_x = piece_x + (cellWidth / 2);
        var text_y = piece_y + (cellHeight / 2);
        ctx.font = Math.floor(cellHeight * 0.8) + "px Sans";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = textColor;
        ctx.fillText(val, text_x, text_y);
    }
}

function convertToText() {
    var buffer = [];
    // for (var i = 0; i < width * height; i++) {
    //     var line = [];
    //     if (grid[i]) {
    //         line.push(grid[i]);
    //     } else {
    //         line.push(' ');
    //     }
    //     grid[i
    for (var y = 0; y < height; y++) {
        var line = [];
        for (var x = 0; x < width; x++) {
            if (grid[y * width + x]) {
                line.push(grid[y * width + x]);
            } else {
                line.push(' ');
            }
        }
        buffer.push(line.join('').replace(/\s*$/, '\n'));


        // while (grid[y * height + x + 1] != null) {
        //     buffer.push(grid[y * height + x]);
        //     x++;
        // }
    }

    var str = buffer.join('');
    console.log(str);
    return buffer.join('').replace(/\n*$/, '\n');
}

/**
 * Translates mouse coordinates into grid coordinates
 */
function mouseToGrid(pos) {
    return {
        x: Math.floor(pos.x / cellWidth),
        y: Math.floor(pos.y / cellHeight)
    };
}

/**
 * Gets the current mouse position
 */
function getMousePos(evt) {
    var rect = c.getBoundingClientRect();

    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

/**
 * Translates x and y coordinates to a grid array index
 */
function coordsToIndex(pos) {
    return pos.y * width + pos.x;
}

function handleKeyPress(e) {
    var code = e.keyCode;
    if (e.ctrlKey) {
    } else {
        switch (code) {
            case 8: // Backspace
                e.preventDefault();
                cursorPos--;
                grid[cursorPos] = null;
                break;
            case 9: // Tab
                e.preventDefault();
                var oldPos = cursorPos;
                cursorPos = cursorPos - cursorPos % width % 4 + 4;
                for (var i = oldPos; i < cursorPos; i++) {
                    grid[i] = ' ';
                }
                break;
            case 13: // Enter
                e.preventDefault();
                grid[cursorPos] = '\n';
                cursorPos = cursorPos - (cursorPos % width) + width;
                break;
            default:
                // Letters
                if (code >= 65 && code <= 90) {
                    e.preventDefault();
                    if (!e.shiftKey) {
                        code += 32;
                    }
                    print(String.fromCharCode(code));
                } else {
                    if (code in SPECIAL_KEYS) {
                        e.preventDefault();
                        var shift = e.shiftKey ? 1 : 0;
                        print(String.fromCharCode([SPECIAL_KEYS[code][shift]]))
                    }
                }
                break;
        }
    }
}
