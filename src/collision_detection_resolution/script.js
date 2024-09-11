// TODO : integer weight to nodes instead of binary 0 or 1

const mode = document.getElementById("mode");
const heuristics = document.getElementById("heuristics");
const neighbors = document.getElementById("neighbors");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const delta_time = 1;


const player = new Player(new Vector2D(50, 50));


let pressedKeys = {};
document.onkeydown = (e) => { pressedKeys[e.key] = true; }
document.onkeyup = (e) => { pressedKeys[e.key] = false; }


class Circle {
    collided = false;

    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
    }

    draw(context) {
        if (this.collided) {
            context.fillStyle = 'red';
        } else {
            context.fillStyle = 'gray';
        }
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        context.fill();
    }
}


class Rectangle {
    collided = false;

    constructor(position, w, h) {
        this.position = position;
        this.w = w;
        this.h = h;
    }

    draw(context) {
        if (this.collided) {
            context.fillStyle = 'red';
        } else {
            context.fillStyle = 'gray';
        }
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.w, this.h);
        ctx.fill();
    }
}


const circle = new Circle(new Vector2D(400, 400), 30);
const circle_2 = new Circle(new Vector2D(150, 150), 50);
const rect = new Rectangle(new Vector2D(250, 250), 100, 50);
const rect_3 = new Rectangle(new Vector2D(450, 150), 100, 50);


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




function player_rectangle_collision_detection_and_resolution(player, rectangle) {
    const rect_center = new Vector2D(rectangle.position.x + rectangle.w / 2, rectangle.position.y + rectangle.h / 2);
    dist_x = Math.abs(player.position.x - rect_center.x);
    dist_y = Math.abs(player.position.y - rect_center.y);

    if (dist_x > rectangle.w / 2 + player.radius) return false;
    if (dist_y > rectangle.h / 2 + player.radius) return false;

    ctx.strokeStyle = 'blue';

    if (dist_x <= rectangle.w / 2) {
        let new_pos;
        if (player.position.y > rect_center.y) {
            // console.log('down');
            new_pos = new Vector2D(player.position.x, rect_center.y + rectangle.h / 2 + player.radius);
        } else {
            // console.log('up');
            new_pos = new Vector2D(player.position.x, rect_center.y - rectangle.h / 2 - player.radius);
        }
        ctx.beginPath();
        ctx.arc(new_pos.x, new_pos.y, 2, 0, 2 * Math.PI, false);
        ctx.stroke();
        player.position = new_pos;
        player.velocity.y = 0;
        return true;
    }
    if (dist_y <= rectangle.h / 2) {
        let new_pos;
        if (player.position.x > rect_center.x) {
            // console.log('right');
            new_pos = new Vector2D(rect_center.x + rectangle.w / 2 + player.radius, player.position.y);
        } else {
            // console.log('left');
            new_pos = new Vector2D(rect_center.x - rectangle.w / 2 - player.radius, player.position.y);
        }
        ctx.beginPath();
        ctx.arc(new_pos.x, new_pos.y, 2, 0, 2 * Math.PI, false);
        ctx.stroke();
        player.position = new_pos;
        player.velocity.x = 0;
        return true;
    }

    corner_dist_sq = (dist_x - rectangle.w / 2) ** 2 + (dist_y - rectangle.h / 2) ** 2;

    if (corner_dist_sq <= player.radius ** 2) {
        let corner;
        if (player.position.y > rect_center.y) {
            if (player.position.x > rect_center.x) {
                // console.log('down right');
                corner = rect_center.add(new Vector2D(rectangle.w / 2, rectangle.h / 2));
            } else {
                // console.log('down left');
                corner = rect_center.add(new Vector2D(- rectangle.w / 2, rectangle.h / 2));
            }
        } else {
            if (player.position.x > rect_center.x) {
                // console.log('up right');
                corner = rect_center.add(new Vector2D(rectangle.w / 2, - rectangle.h / 2));
            } else {
                // console.log('up left');
                corner = rect_center.add(new Vector2D(- rectangle.w / 2, - rectangle.h / 2));
            }
        }
        const corner_to_player = player.position.substract(corner);
        const new_pos = corner.add(corner_to_player.unit().multiply(player.radius));
        ctx.beginPath();
        ctx.arc(new_pos.x, new_pos.y, 2, 0, 2 * Math.PI, false);
        ctx.stroke();
        player.position = new_pos;
        player.velocity = player.velocity.multiply(0.97); // not a fan, longing for better solution
        return true;
    } else {
        return false;
    }
}






function player_rectangle_collision_detection(player, rectangle) {
    // thanks to e.James
    // https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection

    dist_x = Math.abs(player.position.x - (rectangle.position.x + rectangle.w / 2));
    dist_y = Math.abs(player.position.y - (rectangle.position.y + rectangle.h / 2));

    if (dist_x > rectangle.w / 2 + player.radius) return false;
    if (dist_y > rectangle.h / 2 + player.radius) return false;

    if (dist_x <= rectangle.w / 2) return true;
    if (dist_y <= rectangle.h / 2) return true;

    corner_dist_sq = (dist_x - rectangle.w / 2) ** 2 + (dist_y - rectangle.h / 2) ** 2;

    return corner_dist_sq <= player.radius ** 2;
}



function draw_vector(start, vector, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(start.x + vector.x, start.y + vector.y);
    ctx.stroke();
}


function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return [x, y]
}




function player_circle_collision_detection(player, circle) {
    distance = Math.sqrt((player.position.x - circle.position.x) ** 2 + (player.position.y - circle.position.y) ** 2);
    if (distance > player.radius + circle.radius) {
        return false;
    } else {
        return true;
    }
}


function player_circle_collision_handling(player, circle) {
    const v = player.position.substract(circle.position);
    if (v.magnitude() < player.radius + circle.radius) {
        player.position = circle.position.add(v.unit().multiply(player.radius + circle.radius));
        player.velocity = player.velocity.multiply(0.97); // not a fan, longing for better solution
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




function handle_collisions() {
    player_circle_collision_handling(player, circle);
    player_rectangle_collision_detection_and_resolution(player, rect_3)

    if (player_circle_collision_detection(player, circle_2)) {
        circle_2.collided = true;
    } else {
        circle_2.collided = false;
    }

    if (player_rectangle_collision_detection(player, rect)) {
        rect.collided = true;
    } else {
        rect.collided = false;
    }

    handle_bounds_collision();
}

function draw() {
    circle_2.draw(ctx);
    circle.draw(ctx);
    rect.draw(ctx);
    rect_3.draw(ctx);
    player.draw(ctx);
}

function game_loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handle_input();
    update();
    handle_collisions()
    draw();
    window.requestAnimationFrame(game_loop);
}

game_loop();