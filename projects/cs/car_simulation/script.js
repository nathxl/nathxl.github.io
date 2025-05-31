const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const dt = 0.016;



const car = new Car();


let pressedKeys = {};
document.onkeydown = (e) => { pressedKeys[e.key] = true; }
document.onkeyup = (e) => { pressedKeys[e.key] = false; }

function update() {
    handleInput(car);
    car.apply_friction(ctx);
    car.applyVelocity(dt);
    car.applyAngularVelocity(dt);
    car.recenter_wheels();


    if (car.v.magnitude() > 0.05) {
        car.v = car.v.add(car.v.unit().multiply(-0.05));
    } else {
        car.v = new Vector3D(0, 0, 0);
    }

    if (Math.abs(car.omega) > 0.005) {
        car.omega += -0.005 * Math.sign(car.omega);
    } else {
        car.omega = 0;
    }
}

function handleInput(rigidBody) {
    // r
    if (pressedKeys['r']) {
        pressedKeys['r'] = false;
        rigidBody.reset();
    }

    // wheels
    if (pressedKeys['z']) rigidBody.move_forward(ctx);
    if (pressedKeys['s']) rigidBody.move_backward(ctx);
    if (pressedKeys['q']) rigidBody.turn_wheels(-1);
    if (pressedKeys['d']) rigidBody.turn_wheels(+1);

}

function draw() {
    car.draw();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw();
    update();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();