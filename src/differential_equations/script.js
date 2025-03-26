const graph = document.getElementById("graph");
const graph_ctx = graph.getContext("2d");

const pendulum = document.getElementById("pendulum");
const pendulum_ctx = pendulum.getContext("2d");

const L = document.getElementById("L");
const mu = document.getElementById("mu");

const delta_time = 0.01;
const max_time = 25;

const g = 9.8;
L.value = 2;
mu.value = 0.4;

const THETA_0 = Math.PI / 3; // 60 degrees
const THETA_DOT_0 = 0; // No initial angular velocity


let points = [];
let index = 0;

let pause = false;

const scaling = 50;
const x_origin = pendulum.width / 2;
const y_origin = 50;

function draw_pendulum(ctx, index) {

    const x = Number(L.value) * Math.sin(points[index]);
    const y = Number(L.value) * Math.cos(points[index]);

    ctx.beginPath();
    ctx.moveTo(x_origin, y_origin);
    ctx.lineTo(x_origin + x * scaling, y_origin + y * scaling);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x_origin + x * scaling, y_origin + y * scaling, 10, 0, 2 * Math.PI, false)
    ctx.stroke();
}


const x_offset = 50;
const y_offset = graph.height / 2;
const x_scaling = 20;
const y_scaling = 100;

function draw_graph(ctx, index) {
    // draw points
    ctx.strokeStyle = 'green';
    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(i * delta_time * x_scaling + x_offset, points[i] * y_scaling + y_offset, 1, 0, 2 * Math.PI, false)
        ctx.stroke();
    }

    // draw current point
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(index * delta_time * x_scaling + x_offset, points[index] * y_scaling + y_offset, 5, 0, 2 * Math.PI, false)
    ctx.stroke();

    // draw y axis
    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(x_offset, 0);
    ctx.lineTo(x_offset, graph.height);
    ctx.stroke();

    // draw x axis
    ctx.beginPath();
    ctx.moveTo(0, y_offset);
    ctx.lineTo(graph.width, y_offset);
    ctx.stroke();


}

function get_theta_dot_dot(theta, theta_dot) {
    return - Number(mu.value) * theta_dot - (g / Number(L.value)) * Math.sin(theta);
}

function compute(t) {
    let theta = THETA_0;
    let theta_dot = THETA_DOT_0;
    for (let time = 0; time <= t; time += delta_time) {
        const theta_dot_dot = get_theta_dot_dot(theta, theta_dot);
        theta += theta_dot * delta_time;
        theta_dot += theta_dot_dot * delta_time;
        points.push(theta);
    }
}


function toggle_pause() {
    pause = !pause;
    if (!pause) game_loop();
}

function restart() {
    index = 0;
}

function recompute() {
    points = [];
    index = 0;
    compute(max_time);
}


function update() {
    index++;
    if (index >= points.length) index = 0;
}

function game_loop() {
    pendulum_ctx.clearRect(0, 0, pendulum.width, pendulum.height);
    graph_ctx.clearRect(0, 0, graph.width, graph.height);
    update();
    draw_pendulum(pendulum_ctx, index);
    draw_graph(graph_ctx, index);

    if (!pause) window.requestAnimationFrame(game_loop);
}


compute(max_time);
game_loop();