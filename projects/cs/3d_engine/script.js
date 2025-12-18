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
cube.translate(-0.5, -0.5, -0.5);


let count = 0;
let increment = 1;


let pressed_keys = {};
document.onkeydown = (e) => { pressed_keys[e.key] = true; }
document.onkeyup = (e) => { pressed_keys[e.key] = false; }


let last_mouse_pos = [0, 0];
let dragging = false;
canvas.addEventListener("mousedown", (e) => {
    dragging = true;
    last_mouse_pos = [e.clientX, e.clientY];
    console.log(last_mouse_pos);
});

canvas.addEventListener("mouseup", (e) => {
    dragging = false;
});

canvas.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const delta = [e.clientX - last_mouse_pos[0], e.clientY - last_mouse_pos[1]];
    camera.myPitch(delta[1] * 0.2 * camera.rotation_speed);
    camera.myYaw(delta[0] * 0.2 * camera.rotation_speed);
    last_mouse_pos = [e.clientX, e.clientY];
});

canvas.addEventListener("wheel", (e) => {
    if (!focused) return;
    e.preventDefault();
    if (e.deltaY > 0) {
        camera.moveDown(0.5);
    } else {
        camera.moveUp(0.5);
    }
},
    { passive: false } // REQUIRED
);


let focused = false;
canvas.addEventListener("focus", () => {
    focused = true;
});

canvas.addEventListener("blur", () => {
    focused = false;
});

function handle_input() {
    if (pressed_keys['w']) {
        camera.moveUp(0.1);
    }
    if (pressed_keys['x']) {
        camera.moveDown(0.1);
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

    if (pressed_keys['i']) {
        camera.myPitch(- camera.rotation_speed);
    }
    if (pressed_keys['k']) {
        camera.myPitch(+ camera.rotation_speed);
    }
    if (pressed_keys['j']) {
        camera.myYaw(- camera.rotation_speed);
    }
    if (pressed_keys['l']) {
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
    if (count < 0) {
        increment = 1;
    } else if (count > 100) {
        increment = -1;
    }
    count = count + increment;

    cube.rotate_y(Math.PI / 300);
    // cube.rotate_x(Math.PI / 300);
    // cube.rotate_z(Math.PI / 500);

    if (increment > 0) {
        cube.scale(1.003);
    } else {
        cube.scale(0.997);
    }

    cube.translate(+1.5, +1.5, +1.5);

}

function recenter() {
    cube.translate(-1.5, -1.5, -1.5);
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
    recenter();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();

// Let's code 3D Engine in Python from Scratch
// --------------------------
// ARRIVED AT 9:28