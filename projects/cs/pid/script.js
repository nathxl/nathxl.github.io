// Thanks to 
// PID Controller Implementation in Software - Phil's Lab #6
// https://www.youtube.com/watch?v=zOByx3Izf5U


const mode = document.getElementById("mode");

const target = document.getElementById("target");
const sensor_delay = document.getElementById("sensor_delay");
const max_heating_speed = document.getElementById("max_heating_speed");
const cooling_factor = document.getElementById("cooling_factor");
const K_p = document.getElementById("K_p");
const K_i = document.getElementById("K_i");
const K_d = document.getElementById("K_d");
const tau = document.getElementById("tau");
const heater_mode = document.getElementById("heater_mode");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


class MaxLengthArray {
    array = []
    max_length = 100;
    constructor(max_length) {
        this.max_length = max_length;
    }

    push(element) {
        this.array.push(element);
        if (this.array.length > this.max_length) this.array.shift();
    }
}

let t = 0;

const max_array_length = 500;

let temperature = 0;
let temperature_history = new MaxLengthArray(max_array_length);

let pause = false;

sensor_delay.value = 20;
cooling_factor.value = 0.1;
K_p.value = 0.05;
K_i.value = 0.05;
K_d.value = 0.05;
tau.value = 20;

const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, "red");
gradient.addColorStop(1, "LightGreen");


// TODO find good value for f0
// let f0 = 30; // f0 : cut-off frequency
// let tau = 1 / (2 * Math.PI * f0); // low pass filter time constant
let limMin = 0;
let limMax = 1;
let T = 1 / 60; // period (or time delta between two samples)

let prevIntegrator = 0;
let prevDifferentiator = 0;
let prevError = 0;
let prevMeasurement = 0;

let sensor = 0;



let pressedKeys = {};
document.onkeydown = (e) => { pressedKeys[e.key] = true; }
document.onkeyup = (e) => { pressedKeys[e.key] = false; }


function handle_input() {
    if (pressedKeys['ArrowUp']) temperature += 0.3;
    if (pressedKeys['ArrowDown']) temperature -= 0.3;
}


function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}


function basic(setpoint, measurement) {
    if (measurement < setpoint) return limMax;
    return limMin;
}


function PID(setpoint, measurement) {

    // error
    const error = setpoint - measurement;

    // console.log(measurement);

    // Proportional
    const proportional = Number(K_p.value) * error;

    // Integrator
    let integrator = prevIntegrator + 0.5 * Number(K_i.value) * T * (error + prevError);

    // anti-wind-up via dynamic integrator clamping
    let limMinInt; // min limit of the integrator
    let limMaxInt;

    if (limMax > proportional) {
        limMaxInt = limMax - proportional;
    } else {
        limMaxInt = 0;
    }

    if (limMin < proportional) {
        limMinInt = limMin - proportional;
    } else {
        limMinInt = 0;
    }

    integrator = clamp(integrator, limMinInt, limMaxInt);

    // Differentiator (derivative on measurement and not on the error !!! because otherwise we can have a kick problem)
    let differentiator = 2 * Number(K_d.value) * (measurement - prevMeasurement);
    differentiator += (2 * Number(tau.value) - T) * prevDifferentiator;
    differentiator /= (2 * Number(tau.value) + T);

    let out = proportional + integrator + differentiator;
    out = clamp(out, limMin, limMax);

    prevIntegrator = integrator;
    prevDifferentiator = differentiator;
    prevError = error;
    prevMeasurement = measurement;

    return out;
}



function get_height(temperature) {
    return -4 * temperature + 400;
}



function update_sensor() {
    // sensor = temperature;
    const length = temperature_history.array.length;
    sensor = temperature_history.array[length - 1 - Number(sensor_delay.value)] || 0;
}


function update_temperature() {
    temperature -= Number(cooling_factor.value);
    temperature = clamp(temperature, 0, 100);
    temperature_history.push(temperature);
}


function update_time() {
    t++;
    if (t > 500) t = 0;
}

function draw_gauge() {
    // draw gradient
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.rect(100, 100, 50, 400);
    ctx.fill();
    ctx.stroke();

    // draw white rectangle
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.rect(100, 100, 50, get_height(temperature));
    ctx.fill();
    ctx.stroke();

    // draw target
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(90, 100 + get_height(target.value));
    ctx.lineTo(160, 100 + get_height(target.value));
    ctx.stroke();

    // draw text
    ctx.textAlign = "right";
    ctx.fillStyle = 'black';
    ctx.font = "20px serif";
    ctx.fillText("100", 95, 115);
    ctx.fillText("0", 95, 500);

    ctx.textAlign = "left";
    ctx.fillText(temperature.toFixed(2), 155, 108 + get_height(temperature));
}


function draw_graph() {
    // draw temperature
    const length = temperature_history.array.length;
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let index = 0; index < length; index++) {
        const temperature = temperature_history.array[length - 1 - index];
        ctx.lineTo(800 - (1 * index), 100 + get_height(temperature));
    }
    ctx.stroke();

    // draw target
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 25]);
    ctx.beginPath();
    ctx.moveTo(300, 100 + get_height(target.value));
    ctx.lineTo(800, 100 + get_height(target.value));
    // ctx.arc(800, 100 + get_height(target.value), 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // draw axis
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(300, 500);
    ctx.lineTo(800, 500);
    ctx.lineTo(800, 100);
    ctx.stroke();

    // draw time
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(800 - t, 100);
    ctx.lineTo(800 - t, 500);
    ctx.stroke();
}

function draw() {
    draw_gauge();
    draw_graph();
}


function toggle_pause() {
    pause = !pause;
    if (!pause) gameLoop();
}


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mode.value == 'pid') temperature += PID(Number(target.value), sensor);
    else if (mode.value == 'basic') temperature += basic(Number(target.value), sensor);
    handle_input();
    update_temperature();
    update_sensor();
    update_time();
    draw();

    if (!pause) window.requestAnimationFrame(gameLoop);
}

gameLoop();