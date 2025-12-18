const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const inputForce = 100;
const inputTorque = 4000;
const mu = 5;
const dt = 0.016;
const g = 40;

/* const sp1 = new SubParticle(new Vector3D(50, 50, 0), 1);
const sp2 = new SubParticle(new Vector3D(150, 50, 0), 1);
const sp3 = new SubParticle(new Vector3D(150, 100, 0), 1);
const sp4 = new SubParticle(new Vector3D(50, 100, 0), 1);
const rb2 = new RigidBody2([sp1, sp2, sp3, sp4]); */

let vertical_vessel = true;

function create_horizontal_vessel() {
    const sp1 = new SubParticle(new Vector3D(50, 50, 0), 1);
    const sp2 = new SubParticle(new Vector3D(150, 50, 0), 1);
    const sp3 = new SubParticle(new Vector3D(150, 100, 0), 1);
    const sp4 = new SubParticle(new Vector3D(50, 100, 0), 1);
    return new RigidBody2([sp1, sp2, sp3, sp4]);
}

function create_vertical_vessel() {
    const sp1 = new SubParticle(new Vector3D(50, 50, 0), 1);
    const sp2 = new SubParticle(new Vector3D(100, 50, 0), 1);
    const sp3 = new SubParticle(new Vector3D(100, 150, 0), 1);
    const sp4 = new SubParticle(new Vector3D(50, 150, 0), 1);
    return new RigidBody2([sp1, sp2, sp3, sp4]);
}

let rb2 = create_vertical_vessel();
rb2.draw_vectors = false;


let target = new Vector3D(canvas.width / 2, canvas.height / 2, 0);


let PID_theta;
let PID_x;
let PID_y;

function init_PIDs_backup() {
    PID_theta = new PID();
    PID_theta.K_p = 50;
    PID_theta.K_i = 0.3;
    PID_theta.K_d = 180;

    PID_x = new PID();
    PID_x.K_p = 0.065;
    PID_x.K_i = 0.001;
    PID_x.K_d = 1;

    PID_y = new PID();
    PID_y.K_p = 20;
    PID_y.K_i = 0.05;
    PID_y.K_d = 200; //240
}

function init_PIDs() {
    PID_theta = new PID();
    PID_theta.K_p = 65;
    PID_theta.K_i = 0.006;
    PID_theta.K_d = 180;

    PID_x = new PID();
    PID_x.K_p = 0.05;
    PID_x.K_i = 0.005;
    PID_x.K_d = 1;

    PID_y = new PID();
    PID_y.K_p = 15;
    PID_y.K_i = 0.1;
    PID_y.K_d = 200; //240
}

init_PIDs();

const FRAME_COUNT = 12;
const frames = [];
let currentFrame = 0;


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

    init_PIDs();
});



async function load_frames() {
    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = `assets/flame/${i}.gif`;
        await img.decode();
        frames.push(img);
    }
}

function update(total_thrust) {
    handleInput(rb2);
    apply_gravity(rb2);

    left_thrust(total_thrust.x);
    right_thrust(total_thrust.y);

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


function get_total_thrust() {
    const total_thrust = new Vector3D(0, 0, 0);

    const out_theta = PID_theta.compute(0, rb2.theta, dt);
    if (out_theta > 0) {
        total_thrust.x += clamp(Math.abs(out_theta), 0, 30);
    } else if (out_theta < 0) {
        total_thrust.y += clamp(Math.abs(out_theta), 0, 30);
    }

    const out_x = PID_x.compute(target.x, rb2.r.x, dt);
    if (out_x > 0) {
        total_thrust.x += clamp(Math.abs(out_x), 0, 30);
    } else if (out_x < 0) {
        total_thrust.y += clamp(Math.abs(out_x), 0, 30);
    }

    const out_y = PID_y.compute(target.y, rb2.r.y, dt);
    if (out_y < 0) {
        total_thrust.x += clamp(Math.abs(out_y), 0, 30);
        total_thrust.y += clamp(Math.abs(out_y), 0, 30);
    }

    return total_thrust;
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
    // r
    if (pressedKeys['r']) {
        pressedKeys['r'] = false;
        rb2.reset();
        init_PIDs();
    }

    if (pressedKeys['t']) {
        pressedKeys['t'] = false;
        if (vertical_vessel) {
            rb2 = create_horizontal_vessel();
        } else {
            rb2 = create_vertical_vessel();
        }
        vertical_vessel = !vertical_vessel;
        rb2.draw_vectors = false;
        init_PIDs();
        // rb2.reset();
    }

}

function draw_target() {
    ctx.strokeStyle = "orange";
    ctx.beginPath();
    ctx.arc(target.x, target.y, 10, 0, 2 * Math.PI);
    ctx.stroke();
}

function draw_flame(x, y, theta, scale) {
    const img = frames[currentFrame];
    ctx.save();
    ctx.translate(x + img.width / 2, y + img.height);
    ctx.rotate(theta);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.width / 2, -img.height);

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    ctx.strokeRect(-img.width / 2, -img.height, img.width, img.height);

    ctx.restore();
    currentFrame = (currentFrame + 1) % FRAME_COUNT;
}

function draw(total_thrust) {
    ctx.lineWidth = 2;
    rb2.draw();
    draw_target();

    const img = frames[currentFrame];
    const image_offset = new Vector3D(-img.width / 2, - img.height, 0);

    const relative_location_l = rb2.subParticles[3].r.rotateAroundZ(rb2.theta);
    const absolute_location_l = rb2.r.add(relative_location_l).add(image_offset);
    draw_flame(absolute_location_l.x, absolute_location_l.y, rb2.theta + Math.PI, total_thrust.x / 20);

    const relative_location_r = rb2.subParticles[2].r.rotateAroundZ(rb2.theta);
    const absolute_location_r = rb2.r.add(relative_location_r).add(image_offset);
    draw_flame(absolute_location_r.x, absolute_location_r.y, rb2.theta + Math.PI, total_thrust.y / 20);
}



function main_loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const total_thrust = get_total_thrust();
    draw(total_thrust);
    update(total_thrust);
    window.requestAnimationFrame(main_loop);
}

async function main() {
    await load_frames();
    main_loop();
}


main();