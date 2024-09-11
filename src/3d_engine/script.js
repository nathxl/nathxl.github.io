// Let's code 3D Engine in Python from Scratch
// https://www.youtube.com/watch?v=M_Hx0g5vFko

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

cube_vertexes = [[[0, 0, 0, 1]], [[0, 1, 0, 1]], [[1, 1, 0, 1]], [[1, 0, 0, 1]], [[0, 0, 1, 1]], [[0, 1, 1, 1]], [[1, 1, 1, 1]], [[1, 0, 1, 1]]];
cube_faces = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 4, 5, 1], [2, 3, 7, 6], [1, 2, 6, 5], [0, 3, 7, 4]];

axes_vertexes = [[[0, 0, 0, 1]], [[1, 0, 0, 1]], [[0, 1, 0, 1]], [[0, 0, 1, 1]]];
axes_faces = [[0, 1], [0, 2], [0, 3]];

let cube = new Object3d(cube_vertexes, cube_faces);
let axes = new Object3d(axes_vertexes, axes_faces);
let camera = new Camera(1, 1.5, -10);

axes.scale(3);
cube.translate(0.5, 0.5, 0.5);



let pressed_keys = {};
document.onkeydown = (e) => { pressed_keys[e.key] = true; }
document.onkeyup = (e) => { pressed_keys[e.key] = false; }

function handle_input() {
    if (pressed_keys[' ']) {
        camera.moveUp();
    }
    if (pressed_keys['c']) {
        camera.moveDown();
    }
    if (pressed_keys['q']) {
        camera.moveLeft();
    }
    if (pressed_keys['d']) {
        camera.moveRight();
    }
    if (pressed_keys['z']) {
        camera.moveForward();
    }
    if (pressed_keys['s']) {
        camera.moveBackward();
    }

    if (pressed_keys['ArrowUp']) {
        camera.myPitch(- camera.rotation_speed);
    }
    if (pressed_keys['ArrowDown']) {
        camera.myPitch(+ camera.rotation_speed);
    }
    if (pressed_keys['ArrowLeft']) {
        camera.myYaw(- camera.rotation_speed);
    }
    if (pressed_keys['ArrowRight']) {
        camera.myYaw(+ camera.rotation_speed);
    }
    if (pressed_keys['a']) {
        camera.myRoll(+ camera.rotation_speed);
    }
    if (pressed_keys['e']) {
        camera.myRoll(- camera.rotation_speed);
    }
}

function update() {
    cube.translate(-1, -1, -1);
    cube.rotate_y(Math.PI / 300);
    cube.translate(+1, +1, +1);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cube.draw(camera);
    axes.draw(camera);
}

function gameLoop() {
    handle_input();
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
}

// test zone
gameLoop();

// Let's code 3D Engine in Python from Scratch
// --------------------------
// ARRIVED AT 9:28