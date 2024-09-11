const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const tile_size = 40;
const mouse_offset_x = canvas.offsetLeft + 1;
const mouse_offset_y = canvas.offsetTop + 1


const delta_time = 1;

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
];









const player = new Player(new Vector2D(50, 50));

let pressedKeys = {};
document.onkeydown = (e) => { pressedKeys[e.key] = true; }
document.onkeyup = (e) => { pressedKeys[e.key] = false; }




class Circle {
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
    }

    draw(context) {
        context.strokeStyle = 'black';
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        context.stroke();
    }
}


const circle = new Circle(new Vector2D(400, 400), 30);


function collision_test(player, circle) {
    const v = player.position.substract(circle.position);
    if (v.magnitude() < player.radius + circle.radius) {
        console.log('collision');
        player.position = circle.position.add(v.unit().multiply(player.radius + circle.radius));
        // player.velocity = player.velocity.multiply(0.9);
    }
}


class Rectangle {
    constructor(position, w, h) {
        this.position = position;
        this.w = w;
        this.h = h;
    }
}

function is_in_bounds(map, row, col) {
    if (row >= 0 && row < map.length && col >= 0 && col < map[row].length) return true;
    return false;
}



function check_rect_collision_backup(player, rect) {
    // thanks to e.James
    // https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection

    dist_x = Math.abs(player.position.x - (rect.position.x + rect.w / 2));
    dist_y = Math.abs(player.position.y - (rect.position.y + rect.h / 2));

    if (dist_x > rect.w / 2 + player.radius) return false;
    if (dist_y > rect.h / 2 + player.radius) return false;

    if (dist_x <= rect.w / 2) return true;
    if (dist_y <= rect.h / 2) return true;

    corner_dist_sq = (dist_x - rect.w / 2) ** 2 + (dist_y - rect.h / 2) ** 2;

    if (corner_dist_sq <= player.radius ** 2) {
        console.log('corner');
        return true;
    }
    return false;
    // return corner_dist_sq <= player.radius ** 2;
}




function check_rect_collision(player, rect) {
    // thanks to e.James
    // https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection

    let collision = false;

    const dist_x = Math.abs(player.position.x - (rect.position.x + rect.w / 2));
    const dist_y = Math.abs(player.position.y - (rect.position.y + rect.h / 2));

    if (dist_x > rect.w / 2 + player.radius) return;
    if (dist_y > rect.h / 2 + player.radius) return;

    const offset = new Vector2D(tile_size / 2, tile_size / 2);
    const rect_to_player_vector = player.position.substract(rect.position.add(offset));

    if (dist_x <= rect.w / 2) {
        collision = true;
        if (rect_to_player_vector.y > 0) {
            console.log('down');
        } else {
            console.log('up');
        }
    }

    if (dist_y <= rect.h / 2) {
        collision = true;
        if (rect_to_player_vector.x > 0) {
            console.log('right');
        } else {
            console.log('left');
        }
    }

    const corner_dist_sq = (dist_x - rect.w / 2) ** 2 + (dist_y - rect.h / 2) ** 2;

    if (corner_dist_sq < player.radius ** 2 - 10) { // the - 10 term is there to limit corner detection when sliding along straight wall
        // console.log('corner');
        collision = true;

        if (rect_to_player_vector.y > 0) {
            if (rect_to_player_vector.x > 0) {
                console.log('down right');
            } else {
                console.log('down left');
            }
        } else {
            if (rect_to_player_vector.x > 0) {
                console.log('up right');
            } else {
                console.log('up left');
            }
        }
    }
    if (collision) {
        player.apply_force(rect_to_player_vector.unit().multiply(1), delta_time);
    }
    // return corner_dist_sq <= player.radius ** 2;
}

function handle_bounds_collision() {
    if (player.position.x < player.radius) {
        player.position.x = player.radius;
        player.velocity.x = -player.velocity.x / 5;
    }
    if (player.position.y < player.radius) {
        player.position.y = player.radius;
        player.velocity.y = -player.velocity.y / 5;
    }
    if (player.position.x > canvas.width - player.radius) {
        player.position.x = canvas.width - player.radius;
        player.velocity.x = -player.velocity.x / 5;
    }
    if (player.position.y > canvas.height - player.radius) {
        player.position.y = canvas.height - player.radius;
        player.velocity.y = -player.velocity.y / 5;
    }
}


function handle_collision() {
    const col = parseInt(Math.floor(player.position.x / tile_size));
    const row = parseInt(Math.floor(player.position.y / tile_size));

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (!is_in_bounds(map, row + i, col + j)) continue;
            if (map[row + i][col + j] != 0) continue;
            const rect = new Rectangle(new Vector2D((col + j) * tile_size, (row + i) * tile_size), tile_size, tile_size);
            check_rect_collision(player, rect);
            /* if (check_rect_collision(player, rect)) {
                const rect_to_player_vector = player.position.substract(rect.position.add(new Vector2D(tile_size / 2, tile_size / 2)));
                const angle = rect_to_player_vector.angle_with(new Vector2D(1, 0));
                if (angle >= (1 / 4) * Math.PI && angle < (3 / 4) * Math.PI) {
                    // down wall collision
                    player.velocity.y = 0;
                } else if (angle >= (3 / 4) * Math.PI && angle < (5 / 4) * Math.PI) {
                    // left wall collision
                    player.velocity.x = 0;
                } else if (angle >= (5 / 4) * Math.PI && angle < (7 / 4) * Math.PI) {
                    // up wall collision
                    player.velocity.y = 0;
                } else {
                    // right wall collision
                    player.velocity.x = 0;
                }
                player.apply_force(rect_to_player_vector.unit().multiply(0.75), delta_time);
            } */
        }
    }
    handle_bounds_collision();

}


function handle_collision_backup() {
    const col = parseInt(Math.floor(player.position.x / tile_size));
    const row = parseInt(Math.floor(player.position.y / tile_size));

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (!is_in_bounds(map, row + i, col + j)) continue;
            if (map[row + i][col + j] != 0) continue;
            const rect = new Rectangle(new Vector2D((col + j) * tile_size, (row + i) * tile_size), tile_size, tile_size);
            if (check_rect_collision(player, rect)) {
                const rect_to_player_vector = player.position.substract(rect.position.add(new Vector2D(tile_size / 2, tile_size / 2)));
                const angle = rect_to_player_vector.angle_with(new Vector2D(1, 0));
                if (angle >= (1 / 4) * Math.PI && angle < (3 / 4) * Math.PI) {
                    // down wall collision
                    player.velocity.y = 0;
                } else if (angle >= (3 / 4) * Math.PI && angle < (5 / 4) * Math.PI) {
                    // left wall collision
                    player.velocity.x = 0;
                } else if (angle >= (5 / 4) * Math.PI && angle < (7 / 4) * Math.PI) {
                    // up wall collision
                    player.velocity.y = 0;
                } else {
                    // right wall collision
                    player.velocity.x = 0;
                }
                player.apply_force(rect_to_player_vector.unit().multiply(0.75), delta_time);
            }
        }
    }
    handle_bounds_collision();

}


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





function handle_input() {
    if (pressedKeys['ArrowLeft']) player.apply_force(new Vector2D(-1, 0), delta_time);
    if (pressedKeys['ArrowRight']) player.apply_force(new Vector2D(+1, 0), delta_time);
    if (pressedKeys['ArrowUp']) player.apply_force(new Vector2D(0, -1), delta_time);
    if (pressedKeys['ArrowDown']) player.apply_force(new Vector2D(0, +1), delta_time);
}

function update() {

    player.update(delta_time);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_map(map);

    circle.draw(ctx);

    player.draw(ctx);
}

function game_loop() {
    handle_input();
    handle_collision();
    update();
    collision_test(player, circle);
    draw();
    window.requestAnimationFrame(game_loop);
}

game_loop();