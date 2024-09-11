const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const f_input = 200;
const mu = 5;
const dt = 0.016;
const g = 9.81;

const p1 = new Particle(new Vector(50, 50), 1);

let pressedKeys = {};
document.onkeydown = (e) => { pressedKeys[e.key] = true; }
document.onkeyup = (e) => { pressedKeys[e.key] = false; }

function update() {
    applyInputForces(p1);
    applyFrictionForces(p1);

    p1.move(dt);

    resolveBorderCollision(p1);
}

function applyInputForces(particle) {
    // f = m.a
    const a = f_input / particle.m;

    let direction = new Vector(0, 0)
    if (pressedKeys['ArrowLeft']) {
        direction.x -= 1;
    }
    if (pressedKeys['ArrowRight']) {
        direction.x += 1;
    }
    if (pressedKeys['ArrowUp']) {
        direction.y -= 1;
    }
    if (pressedKeys['ArrowDown']) {
        direction.y += 1;
    }

    const acceleration = direction.unit().multiply(a);
    particle.v = particle.v.add(acceleration.multiply(dt));
}

function applyFrictionForces(particle) {
    // f_friction = mu . f_normal = mu . m . g
    // f_friction = m . a
    // => a = mu . g
    const a = mu * g;

    const direction = particle.v.unit().multiply(-1);
    const acceleration = direction.multiply(a);
    particle.v = particle.v.add(acceleration.multiply(dt));
}

function resolveBorderCollision(particle) {
    if (particle.r.x < 0 + particle.radius) {
        particle.r.x = particle.radius;
        particle.v.x = - particle.v.x;
    }
    if (particle.r.y < 0 + particle.radius) {
        particle.r.y = particle.radius;
        particle.v.y = - particle.v.y;
    }
    if (particle.r.x > canvas.width - particle.radius) {
        particle.r.x = canvas.width - particle.radius;
        particle.v.x = - particle.v.x;
    }
    if (particle.r.y > canvas.height - particle.radius) {
        particle.r.y = canvas.height - particle.radius;
        particle.v.y = - particle.v.y;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    p1.draw(ctx);
}

function gameLoop() {
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();