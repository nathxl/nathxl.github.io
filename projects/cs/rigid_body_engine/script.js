const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const inputForce = 100;
const inputTorque = 4000;
const mu = 5;
const dt = 0.016;
const g = 9.81;

const sp1 = new SubParticle(new Vector3D(70, 35, 0), 1);
const sp2 = new SubParticle(new Vector3D(165, 50, 0), 1);
const sp3 = new SubParticle(new Vector3D(200, 125, 0), 5);
const sp4 = new SubParticle(new Vector3D(75, 140, 0), 1);
const sp5 = new SubParticle(new Vector3D(50, 100, 0), 1);
const rb2 = new RigidBody2([sp1, sp2, sp3, sp4, sp5]);


let pressedKeys = {};
document.onkeydown = (e) => { pressedKeys[e.key] = true; }
document.onkeyup = (e) => { pressedKeys[e.key] = false; }

function update() {
    handleInput(rb2);
    rb2.applyVelocity(dt);
    rb2.applyAngularVelocity(dt);
}

function handleInput(rigidBody) {
    // z, q, s, d
    let direction1 = new Vector3D(0, 0, 0)
    if (pressedKeys['q']) direction1.x -= 1;
    if (pressedKeys['d']) direction1.x += 1;
    if (pressedKeys['z']) direction1.y -= 1;
    if (pressedKeys['s']) direction1.y += 1;
    const force1 = direction1.unit().multiply(inputForce);
    rigidBody.applyForce(ctx, new Vector3D(0, 0, 0), force1);

    // spacebar
    if (pressedKeys[' ']) {
        pressedKeys[' '] = false;
        rb2.selectNextParticle();
    }

    // a, e
    const torque = new Vector3D(0, 0, 1).multiply(inputTorque);
    if (pressedKeys['a']) rigidBody.applyTorque(torque.multiply(-1));
    if (pressedKeys['e']) rigidBody.applyTorque(torque);

    // direction
    let direction2 = new Vector3D(0, 0, 0)
    if (pressedKeys['ArrowLeft']) direction2.x -= 1;
    if (pressedKeys['ArrowRight']) direction2.x += 1;
    if (pressedKeys['ArrowUp']) direction2.y -= 1;
    if (pressedKeys['ArrowDown']) direction2.y += 1;
    const force2 = direction2.unit().multiply(inputForce);
    const location = rigidBody.subParticles[rigidBody.selectedParticle].r.rotateAroundZ(rigidBody.theta);
    rigidBody.applyForce(ctx, location, force2);

    // r
    if (pressedKeys['r']) {
        pressedKeys['r'] = false;
        rb2.reset();
    }
}

function draw() {
    ctx.lineWidth = 2;
    rb2.draw();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw();
    update();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();