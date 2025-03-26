// TODO : integer weight to nodes instead of binary 0 or 1

const mode = document.getElementById("mode");
const heuristics = document.getElementById("heuristics");
const neighbors = document.getElementById("neighbors");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const delta_time = 1;

const path = [
    new Vector2D(50, 50),
    new Vector2D(100, 50),
    new Vector2D(100, 100),
    new Vector2D(50, 400),
    new Vector2D(100, 500),
    new Vector2D(500, 500),
    new Vector2D(300, 300),
];
const player = new Player(new Vector2D(50, 50));
player.path = path;


let pressedKeys = {};
document.onkeydown = (e) => { pressedKeys[e.key] = true; }
document.onkeyup = (e) => { pressedKeys[e.key] = false; }





function handle_input() {
    if (pressedKeys['ArrowLeft']) player.apply_force(new Vector2D(-1, 0), delta_time);
    if (pressedKeys['ArrowRight']) player.apply_force(new Vector2D(+1, 0), delta_time);
    if (pressedKeys['ArrowUp']) player.apply_force(new Vector2D(0, -1), delta_time);
    if (pressedKeys['ArrowDown']) player.apply_force(new Vector2D(0, +1), delta_time);
}

function update() {
    player.follow_path(delta_time);
    player.update(delta_time);
}


function draw_path(path) {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    for (const node of path) {
        ctx.lineTo(node.x, node.y);
    }
    ctx.stroke();
}


function draw() {
    draw_path(path);
    player.draw(ctx);
}

function game_loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handle_input();
    update();
    draw();
    window.requestAnimationFrame(game_loop);
}

game_loop();