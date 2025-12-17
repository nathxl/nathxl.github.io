// TODO : integer weight to nodes instead of binary 0 or 1

const mode = document.getElementById("mode");
const heuristics = document.getElementById("heuristics");
const neighbors = document.getElementById("neighbors");

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const tile_size = 40;

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
];

let start_x = 2;
let start_y = 6;
let end_x = 9;
let end_y = 9;


canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();  

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;



    if (x > 0 && y > 0 && x < tile_size * map[0].length && y < tile_size * map.length) {
        const col = parseInt(x / tile_size * (canvas.width / rect.width));
        const row = parseInt(y / tile_size * (canvas.height / rect.height));

        if (mode.value == 'place_block') {
            if (map[row][col] == 0) {
                map[row][col] = 1;
            } else {
                map[row][col] = 0;
            }
        } else if (mode.value == 'place_start') {
            start_x = col;
            start_y = row;
        } else if (mode.value == 'place_end') {
            end_x = col;
            end_y = row;
        }

        find_path();
    }
});


function draw_map(map) {
    for (let row in map) {
        for (let col in map[row]) {
            ctx.fillStyle = 'rgb(50,50,50)';
            ctx.strokeStyle = 'lightgray';
            ctx.strokeStyle = 'rgb(200, 200, 200)';
            ctx.beginPath();
            ctx.rect(col * tile_size, row * tile_size, tile_size, tile_size);
            if (map[row][col] == 0) ctx.fill();
            ctx.stroke();
        }
    }
}


function draw_node(x, y, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    ctx.rect(x * tile_size, y * tile_size, tile_size, tile_size);
    ctx.fill();
    // ctx.stroke();
}

function draw_path(path) {
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    for (const node of path) {
        ctx.lineTo(node.x * tile_size + tile_size / 2, node.y * tile_size + tile_size / 2);
    }
    ctx.stroke();
}

function draw(path) {
    ctx.lineWidth = 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_map(map);
    draw_node(start_x, start_y, 'green');
    draw_node(end_x, end_y, 'red');
    draw_path(path);
}


function find_path() {
    let graph = []
    for (let row = 0; row < map.length; row++) {
        graph.push([])
        for (let col = 0; col < map[row].length; col++) {
            graph[row].push(new Node(col, row, map[row][col]));
        }
    }

    const start = graph[start_y][start_x];
    const end = graph[end_y][end_x];

    let heuristics_function;
    if (heuristics.value == 'manhattan') {
        heuristics_function = manhattan_distance;
    } else if (heuristics.value == 'chebyshev') {
        heuristics_function = chebyshev_distance;
    } else {
        return;
    }

    let neighbors_function;
    if (neighbors.value == '4') {
        neighbors_function = get_4_neighbors;
    } else if (neighbors.value == '8A') {
        neighbors_function = get_8_neighbors_A
    } else if (neighbors.value == '8B') {
        neighbors_function = get_8_neighbors_B
    } else if (neighbors.value == '8C') {
        neighbors_function = get_8_neighbors_C
    } else {
        return;
    }

    const path = a_star(graph, start, end, heuristics_function, neighbors_function);

    draw(path);

}


find_path();