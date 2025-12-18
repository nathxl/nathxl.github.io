const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


const find_nearest_button = document.getElementById("find_nearest");
const mode_select = document.getElementById("mode");

let freeze = false;

find_nearest_button.addEventListener("click", async () => {
    redraw();
    find_nearest_button.disabled = true;
    freeze = true;
    await findNearest(grid, start);
    find_nearest_button.disabled = false;
    freeze = false;
});

canvas.addEventListener("click", (event) => {
    if (freeze) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = parseInt(x / TILE_SIZE * (canvas.width / rect.width));
    const row = parseInt(y / TILE_SIZE * (canvas.height / rect.height));
    console.log(col, row)

    switch (mode_select.value) {
        case "place_start":
            start.x = col;
            start.y = row;
            break;
        case "place_target":
            grid[row][col] = (grid[row][col] == 2) ? 0 : 2;
            break;
        case "place_block":
            grid[row][col] = (grid[row][col] == 1) ? 0 : 1;
            break;
    }
    redraw();

});

class Vector2i {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Vector2i(this.x + other.x, this.y + other.y);
    }

    toString() {
        return `${this.x},${this.y}`;
    }
}


const TILE_SIZE = 30
const ROWS = 20;
const COLS = 20;
// const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
const grid = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
  [1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
  [1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];


grid[1][1] = 2;
grid[18][18] = 2;
grid[1][18] = 2;
grid[18][1] = 2;

const start = new Vector2i(10, 9);

const delay = (delay_ms) => {
    return new Promise(resolve => setTimeout(resolve, delay_ms));
};



// Directions: N, E, S, W
const N = new Vector2i(0, -1);
const E = new Vector2i(1, 0);
const S = new Vector2i(0, 1);
const W = new Vector2i(-1, 0);
const directions = [N, E, S, W];

/**
 * Finds the nearest cell with value 2 in the map
 * @param {number[][]} map 2D grid
 * @param {Vector2i} start Starting position
 * @returns {Vector2i|null} Nearest cell with 2, or null if none
 */
async function findNearest(map, start) {
    const visited = new Set();
    const queue = [];

    queue.push(start);
    visited.add(start.toString());

    while (queue.length > 0) {
        const v = queue.shift(); // remove first

        if (map[v.y][v.x] === 2) {
            draw_cell_circle(v, "blue", 10)
            return v;
        }

        for (const dir of directions) {
            const n = v.add(dir);

            if (n.x >= 0 && n.x < map[0].length &&
                n.y >= 0 && n.y < map.length &&
                !visited.has(n.toString()) &&
                map[n.y][n.x] !== 1) {
                visited.add(n.toString());
                await delay(50);
                draw_cell_circle(n, "yellow", 8)
                queue.push(n);
            }
        }
    }

    return null;
}

function draw_line(p1, p2, color, width) {
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

function draw_cell(col, row, color) {
    ctx.fillStyle = color;
    ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function draw_cell_circle(v, color, radius) {
    ctx.beginPath();
    ctx.arc(v.x * TILE_SIZE + TILE_SIZE / 2, v.y * TILE_SIZE + TILE_SIZE / 2, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function draw_grid() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (grid[row][col] == 1) {
                draw_cell(col, row, "darkgray");
            } else if (grid[row][col] == 2) {
                draw_cell_circle(new Vector2i(col, row), "red", 10);
            }
        }
    }
    //draw_cell(start.x, start.y, "green");
    draw_cell_circle(start, "green", 10);
    for (let row = 0; row <= ROWS; row++) {
        draw_line([0, row * TILE_SIZE], [COLS * TILE_SIZE, row * TILE_SIZE], "black", 1);
    }
    for (let col = 0; col <= COLS; col++) {
        draw_line([col * TILE_SIZE, 0], [col * TILE_SIZE, ROWS * TILE_SIZE], "black", 1);
    }
}


function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_grid();
}

draw_grid();
// const res = findNearest(grid, start);
