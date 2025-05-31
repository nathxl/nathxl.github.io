const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const inputForce = 100;
const inputTorque = 4000;
const mu = 5;
const dt = 0.016;
const g = 40;

const sp1 = new SubParticle(new Vector3D(50, 50, 0), 1);
const sp2 = new SubParticle(new Vector3D(150, 50, 0), 1);
const sp3 = new SubParticle(new Vector3D(150, 100, 0), 1);
const sp4 = new SubParticle(new Vector3D(50, 100, 0), 1);
const rb2 = new RigidBody2([sp1, sp2, sp3, sp4]);


let target = new Vector3D(canvas.width / 2, canvas.height / 2, 0);


const PID_theta = new PID();
PID_theta.K_p = 50;
PID_theta.K_i = 0.3;
PID_theta.K_d = 180;

const PID_x = new PID(); 
PID_x.K_p = 0.065;
PID_x.K_i = 0.001;
PID_x.K_d = 1;


const PID_y = new PID();
PID_y.K_p = 20;
PID_y.K_i = 0.05;
PID_y.K_d = 200; //240


let pressedKeys = {};
document.onkeydown = (e) => { pressedKeys[e.key] = true; }
document.onkeyup = (e) => { pressedKeys[e.key] = false; }

canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const border_width = (canvas.offsetWidth - canvas.width) / 2;
    const x = event.x - (rect.left + border_width);
    const y = event.y - (rect.top + border_width);

    target.x = x;
    target.y = y;
});

function update() {
    handleInput(rb2);
    apply_gravity(rb2);
    pid_theta();
    pid_x();
    pid_y();
    rb2.applyVelocity(dt);
    rb2.applyAngularVelocity(dt);
}

function apply_gravity(rigid_body) {
    const force = (new Vector3D(0, 1, 0)).multiply(g);
    rigid_body.applyForce(ctx, new Vector3D(0, 0, 0), force);
}

function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}


function pid_theta() {
    const out = PID_theta.compute(0, rb2.theta, dt);
    if (out > 0) {
        left_thrust(clamp(Math.abs(out), 0, 50));
    } else if (out < 0) {
        right_thrust(clamp(Math.abs(out), 0, 50));
    }
}

function pid_x() {
    const out_x = PID_x.compute(target.x, rb2.r.x, dt);
    if (out_x > 0) {
        left_thrust(clamp(Math.abs(out_x), 0, 50));
    } else if (out_x < 0) {
        right_thrust(clamp(Math.abs(out_x), 0, 50));
    }
}

function pid_y() {
    const out_y = PID_y.compute(target.y, rb2.r.y, dt);
    if (out_y < 0) {
        left_thrust(clamp(Math.abs(out_y), 0, 50));
        right_thrust(clamp(Math.abs(out_y), 0, 50));
    }
}



function left_thrust(val) {
    const force = (new Vector3D(0, -1, 0)).rotateAroundZ(rb2.theta).unit().multiply(val);
    const location = rb2.subParticles[3].r.rotateAroundZ(rb2.theta);
    rb2.applyForce(ctx, location, force);
}

function right_thrust(val) {
    const force = (new Vector3D(0, -1, 0)).rotateAroundZ(rb2.theta).unit().multiply(val);
    const location = rb2.subParticles[2].r.rotateAroundZ(rb2.theta);
    rb2.applyForce(ctx, location, force);
}

function handleInput(rigidBody) {
    // z, q, s, d
    let direction1 = new Vector3D(0, 0, 0);
    if (pressedKeys['q']) direction1.x -= 1;
    if (pressedKeys['d']) direction1.x += 1;
    if (pressedKeys['z']) direction1.y -= 1;
    if (pressedKeys['s']) direction1.y += 1;
    const force1 = direction1.unit().multiply(inputForce);
    rigidBody.applyForce(ctx, new Vector3D(0, 0, 0), force1);

    // spacebar
    if (pressedKeys['n']) {
        pressedKeys['n'] = false;
        rb2.selectNextParticle();
    }

    // a, e
    const torque = new Vector3D(0, 0, 1).multiply(inputTorque);
    if (pressedKeys['a']) rigidBody.applyTorque(torque.multiply(-1));
    if (pressedKeys['e']) rigidBody.applyTorque(torque);

    // direction
    let direction2 = new Vector3D(0, 0, 0);
    if (pressedKeys['j']) direction2.x -= 1;
    if (pressedKeys['l']) direction2.x += 1;
    if (pressedKeys['i']) direction2.y -= 1;
    if (pressedKeys['k']) direction2.y += 1;
    const force2 = direction2.unit().multiply(inputForce);
    const location = rigidBody.subParticles[rigidBody.selectedParticle].r.rotateAroundZ(rigidBody.theta);
    rigidBody.applyForce(ctx, location, force2);

    // boosters
    if (pressedKeys['w']) {
        const force = (new Vector3D(0, -1, 0)).rotateAroundZ(rigidBody.theta).unit().multiply(25);
        const location = rigidBody.subParticles[3].r.rotateAroundZ(rigidBody.theta);
        rigidBody.applyForce(ctx, location, force);
    }

    if (pressedKeys['x']) {
        const force = (new Vector3D(0, -1, 0)).rotateAroundZ(rigidBody.theta).unit().multiply(25);
        const location = rigidBody.subParticles[2].r.rotateAroundZ(rigidBody.theta);
        rigidBody.applyForce(ctx, location, force);
    }

    // r
    if (pressedKeys['r']) {
        pressedKeys['r'] = false;
        rb2.reset();
    }
}

function draw() {
    ctx.lineWidth = 2;
    rb2.draw();
    draw_target();
}

function draw_target() {
    ctx.beginPath();
    ctx.arc(target.x, target.y, 10, 0, 2 * Math.PI);
    ctx.stroke();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    update();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();