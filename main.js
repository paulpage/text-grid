// Canvas DOM object and drawing context
var c, ctx;

// Width and height of the grid (in cells)
var width = 30;
var height = 20;

// Size of each cell (set automatically)
var cellSize;

var backgroundColor = 'black'; // Color of inactive cells
var foregroundColor = 'white'; // Color of active cells
var gridColor = 'gray'; // Color of dividing lines
var textColor = 'black'; // Color of grid cell text

var offset = 2;

// Array holding grid data
var grid;

/**
 * Automatically set the optimum canvas size based on window width and height
 */
function setCanvasSize() {
    ratio = width / height;
    if (window.innerWidth / width < window.innerHeight / height) {
        c.width = window.innerWidth * 0.8;
        c.height = c.width / width * height;
    } else {
        c.height = window.innerHeight * 0.8;
        c.width = c.height / height * width;
    }
    cellSize = c.width / width;
}

window.onload = function() {

    // Populate grid with 0s
    numCells = width * height;
    grid = Array.apply(null, Array(numCells)).map(Number.prototype.valueOf, 0);

    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
        }
    });

    document.addEventListener('click', function(event) {
        index = coordsToIndex(mouseToGrid(getMousePos(event)));
        grid[index] = (grid[index] == 1 ? 0 : 1);
    });

    c = document.getElementById('canvas');
    ctx = c.getContext('2d');

    setCanvasSize();

    window.addEventListener("resize", setCanvasSize, false);

    requestAnimationFrame(draw);
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
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, c.height);
    }
    for (var y = 0; y < height; y++) {
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(c.width, y * cellSize);
    }
    ctx.stroke();

    for (var i = 0; i < grid.length; i++) {
        drawCell(i, grid[i]);
    }
    requestAnimationFrame(draw);
}

/**
 * Draw each individual cell
 */
function drawCell(pos, val) {
    if (val > 0) {

        var x = pos % width;
        var y = (pos - pos % width) / width;

        var piece_x = x * cellSize;
        var piece_y = y * cellSize;

        ctx.fillStyle = foregroundColor;
        ctx.fillRect(piece_x, piece_y, cellSize, cellSize);

        var text_x = piece_x + (cellSize / 2);
        var text_y = piece_y + (cellSize / 2);
        ctx.font = Math.floor(cellSize * 0.8) + "px Sans";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = textColor;
        ctx.fillText(Math.pow(2, val), text_x, text_y);
    }
}

/**
 * Translates mouse coordinates into grid coordinates
 */
function mouseToGrid(pos) {
    return {
        x: Math.floor(pos.x / cellSize),
        y: Math.floor(pos.y / cellSize)
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
