// 2D Physics Engine from Scratch (JS) 02: Moving the Ball

let x = 0;
let y = 0;

let acc = 0.5;
let friction = 0.02;

const balls = [];

const canvas = document.getElementById('canvas');
const power_slider = document.getElementById("power");
const ctx = canvas.getContext('2d');

const queue = new Queue();

const mousePosition = new Vector2D(0, 0);

let mouseClicked = false;
let pressedKeys = {};
window.onkeyup = (e) => { pressedKeys[e.keyCode] = false }
window.onkeydown = (e) => { pressedKeys[e.keyCode] = true }


canvas.onmousemove = (event) => {
    const rect = canvas.getBoundingClientRect();
    const border_width = 0;
    const x = event.x - (rect.left + border_width);
    const y = event.y - (rect.top + border_width);

    mousePosition.x = (x / rect.width) * canvas.width;
    mousePosition.y = (y / rect.height) * canvas.height;

}

canvas.onmousedown = function (e) {
    mouseClicked = true;
}

let distanceVec = new Vector2D(0, 0);


function penetration_resolution(b1, b2) {
    const dist = b1.r.substract(b2.r);
    const penetration_depth = b1.radius + b2.radius - dist.magnitude();
    const penetration_res = dist.unit().multiply(penetration_depth / 2);
    b1.r = b1.r.add(penetration_res);
    b2.r = b2.r.add(penetration_res.multiply(-1));
}

function collision_detection(b1, b2) {
    return b1.radius + b2.radius >= b2.r.substract(b1.r).magnitude();
}

function collision_resolution(b1, b2) {
    // b2.v = new Vector(10, 0);
    const collision_normal = b1.r.substract(b2.r).unit();
    const relative_velocity = b1.v.substract(b2.v);
    // const separating_velocity = Vector.dot(relative_velocity, collision_normal);
    const separating_velocity = relative_velocity.dot_product(collision_normal);
    const new_sepVel = - separating_velocity;
    const sepVelVec = collision_normal.multiply(new_sepVel);

    b1.v = b1.v.add(sepVelVec);
    b2.v = b2.v.add(sepVelVec.multiply(-1));
}


function handleInput(ball) {
    if (pressedKeys[37]) {
        ball.a.x = - acc;
    }
    if (pressedKeys[38]) {
        ball.a.y = - acc;
    }
    if (pressedKeys[39]) {
        ball.a.x = + acc;
    }
    if (pressedKeys[40]) {
        ball.a.y = + acc;
    }
    if (!pressedKeys[38] && !pressedKeys[40]) {
        ball.a.y = 0;
    }
    if (!pressedKeys[37] && !pressedKeys[39]) {
        ball.a.x = 0;
    }
    if (mouseClicked) {
        const power = Number(power_slider.value);
        balls[0].hit(power, mousePosition);
    }
}


function draw_lines() {
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(1200, 150);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 450);
    ctx.lineTo(1200, 450);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(150, 0);
    ctx.lineTo(150, 600);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1050, 0);
    ctx.lineTo(1050, 600);
    ctx.strokeStyle = "white";
    ctx.stroke();
}


function draw_dots() {
    ctx.beginPath();
    ctx.arc(300, 300, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(300, 225, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(900, 300, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
}


function mainLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    handleInput(balls[0]);

    ctx.fillStyle = "#2A80A8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    draw_lines();
    draw_dots();

    balls.forEach((ball, index) => {
        ball.draw(ctx);

        for (let i = index + 1; i < balls.length; i++) {
            if (collision_detection(balls[index], balls[i])) {
                penetration_resolution(balls[index], balls[i]);
                collision_resolution(balls[index], balls[i]);
            }
        }

        ball.reposition();
    });

    queue.draw(ctx, balls[0].r, mousePosition);

    mouseClicked = false;

    requestAnimationFrame(mainLoop);
}

balls.push(new Ball(300, 225, 15, "white"));
balls.push(new Ball(300, 300, 15, "white"));
balls.push(new Ball(900, 300, 15, "red"));

requestAnimationFrame(mainLoop);