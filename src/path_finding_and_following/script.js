// TODO : integer weight to nodes instead of binary 0 or 1

const mode = document.getElementById("mode");
const heuristics = document.getElementById("heuristics");
const neighbors = document.getElementById("neighbors");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const tile_size = 40;
const mouse_offset_x = canvas.offsetLeft + 1;
const mouse_offset_y = canvas.offsetTop + 1


const delta_time = 1 / 60;

const player = new Player(new Vector2D(20, 20));

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




canvas.addEventListener("mousedown", (event) => {
    const x = event.x - mouse_offset_x;
    const y = event.y - mouse_offset_y;

    if (x > 0 && y > 0 && x < tile_size * map[0].length && y < tile_size * map.length) {
        const col = parseInt(x / tile_size);
        const row = parseInt(y / tile_size);

        if (mode.value == 'place_block') {
            if (map[row][col] == 0) {
                map[row][col] = 1;
            } else {
                map[row][col] = 0;
            }
        } else if (mode.value == 'target') {
            const start = new Vector2D(parseInt(player.position.x / tile_size), parseInt(player.position.y / tile_size));
            const target = new Vector2D(col, row);
            const path = find_path(start, target, map);
            let vector_path = [];
            for (const node of path) vector_path.push(new Vector2D(node.x * tile_size + tile_size / 2, node.y * tile_size + tile_size / 2));
            player.path = vector_path;
            player.current_node = 0;
        }
    }
});


function draw_map(map) {
    for (let row in map) {
        for (let col in map[row]) {
            ctx.fillStyle = 'black';
            ctx.strokeStyle = 'gray';
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
    ctx.stroke();
}

function draw_path(path) {
    if (path.length == 0) return;

    // draw path
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    for (const node of path) {
        ctx.lineTo(node.x * tile_size + tile_size / 2, node.y * tile_size + tile_size / 2);
    }
    ctx.stroke();

    // draw first element
    const first_node = path[0];
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(first_node.x * tile_size + tile_size / 2, first_node.y * tile_size + tile_size / 2, 10, 0, 2 * Math.PI);
    ctx.fill();

    // draw last element
    const last_node = path[path.length - 1]
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(last_node.x * tile_size + tile_size / 2, last_node.y * tile_size + tile_size / 2, 10, 0, 2 * Math.PI);
    ctx.fill();
}


function find_path(start, end, map) {
    let graph = []
    for (let row = 0; row < map.length; row++) {
        graph.push([])
        for (let col = 0; col < map[row].length; col++) {
            graph[row].push(new Node(col, row, map[row][col]));
        }
    }

    const graph_start = graph[start.y][start.x];
    const graph_end = graph[end.y][end.x];

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

    return a_star(graph, graph_start, graph_end, heuristics_function, neighbors_function);

}



function update() {
    player.follow_path(delta_time);
}


function draw() {
    draw_map(map);
    player.draw(ctx, tile_size);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();