// TODO : integer weight to nodes instead of binary 0 or 1

const mode = document.getElementById("mode");
const heuristics = document.getElementById("heuristics");
const neighbors = document.getElementById("neighbors");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");



const delta_time = 1 / 60;

const player = new Player(new Vector2D(20, 20));


const map = new MyMap();





const pressed_keys = {};
document.onkeydown = (e) => { pressed_keys[e.key] = true; }
document.onkeyup = (e) => { pressed_keys[e.key] = false; }


canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const border_width = (canvas.offsetWidth - canvas.width) / 2;
    const x = event.x - (rect.left + border_width);
    const y = event.y - (rect.top + border_width);
    const xy = new Vector2D(x, y);

    if (mode.value == 'place_block') {
        map.place_block(xy);
    } else if (mode.value == 'target') {

        const target = map.xy_to_cr(xy);
        const goto_task = new Goto(player, target, map, get_heuristics_function(), get_neighbors_function());

        if (pressed_keys['Shift']) {
            player.tasks.push(goto_task);
        } else {
            player.tasks = [goto_task];
        }
    }

});


function get_heuristics_function() {
    if (heuristics.value == 'manhattan') {
        return manhattan_distance;
    } else if (heuristics.value == 'chebyshev') {
        return chebyshev_distance;
    } else {
        throw new Error("no heuristics function");
    }
}

function get_neighbors_function() {
    if (neighbors.value == '4') {
        return get_4_neighbors;
    } else if (neighbors.value == '8A') {
        return get_8_neighbors_A
    } else if (neighbors.value == '8B') {
        return get_8_neighbors_B
    } else if (neighbors.value == '8C') {
        return get_8_neighbors_C
    } else {
        throw new Error("no neighbor function");
    }
}


function update() {
    player.update(delta_time);
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    map.draw(ctx);
    player.draw(ctx);
}

function game_loop() {
    update();
    draw();
    window.requestAnimationFrame(game_loop);
}

game_loop();