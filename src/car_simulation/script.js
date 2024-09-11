const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const inputForce = 100;
const inputTorque = 4000;
const mu = 5;
const dt = 0.016;
const g = 9.81;

const sp1 = new SubParticle(new Vector(50, 50, 0), 1);
const sp2 = new SubParticle(new Vector(100, 50, 0), 1);
const sp3 = new SubParticle(new Vector(100, 150, 0), 1);
const sp4 = new SubParticle(new Vector(50, 150, 0), 1);
const rb2 = new RigidBody2([sp1, sp2, sp3, sp4]);






let pressedKeys = {};
document.onkeydown = (e) => { pressedKeys[e.key] = true; }
document.onkeyup = (e) => { pressedKeys[e.key] = false; }

function update() {
    handleInput(rb2);
    rb2.apply_friction(ctx);
    rb2.applyVelocity(dt);
    rb2.applyAngularVelocity(dt);
}

function handleInput(rigidBody) {
    // z, q, s, d
    let direction1 = new Vector(0, 0, 0)
    if (pressedKeys['q']) direction1.x -= 1;
    if (pressedKeys['d']) direction1.x += 1;
    if (pressedKeys['z']) direction1.y -= 1;
    if (pressedKeys['s']) direction1.y += 1;
    const force1 = direction1.unit().multiply(inputForce);
    rigidBody.applyForce(ctx, new Vector(0, 0, 0), force1);

    // spacebar
    if (pressedKeys[' ']) {
        pressedKeys[' '] = false;
        rb2.selectNextParticle();
    }

    // a, e
    const torque = new Vector(0, 0, 1).multiply(inputTorque);
    if (pressedKeys['a']) rigidBody.applyTorque(torque.multiply(-1));
    if (pressedKeys['e']) rigidBody.applyTorque(torque);

    // direction
    /* let direction2 = new Vector(0, 0, 0)
    if (pressedKeys['ArrowLeft']) direction2.x -= 1;
    if (pressedKeys['ArrowRight']) direction2.x += 1;
    if (pressedKeys['ArrowUp']) direction2.y -= 1;
    if (pressedKeys['ArrowDown']) direction2.y += 1;
    const force2 = direction2.unit().multiply(inputForce);
    const location = rigidBody.subParticles[rigidBody.selectedParticle].r.rotateAroundZ(rigidBody.theta);
    rigidBody.applyForce(ctx, location, force2); */

    // r
    if (pressedKeys['r']) {
        pressedKeys['r'] = false;
        rb2.reset();
    }

    // wheels
    if (pressedKeys['ArrowUp']) rb2.move_forward(ctx);
    if (pressedKeys['ArrowDown']) rb2.move_backward(ctx);
    if (pressedKeys['ArrowLeft']) rb2.turn_wheels(-0.01);
    if (pressedKeys['ArrowRight']) rb2.turn_wheels(+0.01);
    /* if (pressedKeys['i']) rb2.move_forward(ctx);
    if (pressedKeys['k']) rb2.move_backward(ctx);
    if (pressedKeys['j']) rb2.turn_wheels(-0.01);
    if (pressedKeys['l']) rb2.turn_wheels(+0.01); */
}

function draw() {
    rb2.draw();


    /* const o = new Vector(300, 300, 0);
    const a = new Vector(50, 50, 0);
    const b = new Vector(100, 20, 0);

    const proj = a.project_onto(b);

    draw_vector(ctx, o, a, 'red');
    draw_vector(ctx, o, b, 'blue');
    draw_vector(ctx, o, proj, 'purple'); */

}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw();
    update();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();