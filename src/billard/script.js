// 2D Physics Engine from Scratch (JS) 02: Moving the Ball

let x = 0;
let y = 0;

let acc = 0.5;
let friction = 0.02;
let hitFactor = 27;

const balls = [];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const queue = new Queue();

const mousePosition = new Vector(0, 0);

let mouseClicked = false;
let pressedKeys = {};
window.onkeyup = (e) => { pressedKeys[e.keyCode] = false }
window.onkeydown = (e) => { pressedKeys[e.keyCode] = true }

canvas.onmousemove = (e) => {
    const x = e.clientX - (canvas.offsetLeft + 1); // the + 1 is the canvas border
    const y = e.clientY - (canvas.offsetTop + 1);
    mousePosition.x = x;
    mousePosition.y = y;
}

canvas.onmousedown = function (e) {
    mouseClicked = true;
}

let distanceVec = new Vector(0, 0);


function penetration_resolution(b1, b2) {
    const dist = b1.r.subtr(b2.r);
    const penetration_depth = b1.radius + b2.radius - dist.mag();
    const penetration_res = dist.unit().mult(penetration_depth / 2);
    b1.r = b1.r.add(penetration_res);
    b2.r = b2.r.add(penetration_res.mult(-1));
}

function collision_detection(b1, b2) {
    return b1.radius + b2.radius >= b2.r.subtr(b1.r).mag();
}

function collision_resolution(b1, b2) {
    // b2.v = new Vector(10, 0);
    const collision_normal = b1.r.subtr(b2.r).unit();
    const relative_velocity = b1.v.subtr(b2.v);
    const separating_velocity = Vector.dot(relative_velocity, collision_normal);
    const new_sepVel = - separating_velocity;
    const sepVelVec = collision_normal.mult(new_sepVel);

    b1.v = b1.v.add(sepVelVec);
    b2.v = b2.v.add(sepVelVec.mult(-1));
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
        balls[0].hit(hitFactor, mousePosition);
    }

    if (pressedKeys[90]) {
        hitFactor += 0.3;
    }
    if (pressedKeys[83]) {
        hitFactor -= 0.3;

        if (hitFactor < 0) {
            hitFactor = 0;
        }
    }
}



function mainLoop() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    handleInput(balls[0]);

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

    

    balls.forEach((ball, index) => {
        ball.draw(ctx);

        for (let i = index + 1; i < balls.length; i++) {
            if (collision_detection(balls[index], balls[i])) {
                penetration_resolution(balls[index], balls[i]);
                collision_resolution(balls[index], balls[i]);
            }
        }

        // ball.display(ctx);
        ball.reposition();
    });

    queue.draw(ctx, balls[0].r, mousePosition);
    ctx.font = "32px serif";
    ctx.fillText(hitFactor.toString().substring(0, 5), 10, 40);

    mouseClicked = false;

    requestAnimationFrame(mainLoop);
}

balls.push(new Ball(300, 225, 15, "white"));
balls.push(new Ball(300, 300, 15, "white"));
balls.push(new Ball(900, 300, 15, "red"));
// balls.push(new Ball(250, 400, 30, "red"));
// balls.push(new Ball(340, 400, 30, "red"));

requestAnimationFrame(mainLoop);