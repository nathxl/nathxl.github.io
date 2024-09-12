const target = document.getElementById("target");
const sensor_delay = document.getElementById("sensor_delay");
const max_heating_speed = document.getElementById("max_heating_speed");
const cooling_factor = document.getElementById("cooling_factor");
const K_p = document.getElementById("K_p");
const K_i = document.getElementById("K_i");
const heater_mode = document.getElementById("heater_mode");


sensor_delay.value = 10;
cooling_factor.value = 0.1;




const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const delta_time = 1 / 60;


const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, "red");
gradient.addColorStop(1, "LightGreen");



class MaxLengthArray {
    array = []
    max_length = 100;
    constructor(max_length) {
        this.max_length = max_length;
    }

    push(element) {
        this.array.push(element);
        if (this.array.length > this.max_length) {
            this.array.shift();
        }
    }
}

const max_array_length = 500;
const max_displayed_points = 500;

let temperature = 50;
let temperature_history = new MaxLengthArray(max_array_length);
let error_history = new MaxLengthArray(max_array_length);
let sensor = 0;


let pause = false;

let pressedKeys = {};
document.onkeydown = (e) => { pressedKeys[e.key] = true; }
document.onkeyup = (e) => { pressedKeys[e.key] = false; }


function get_height(temperature) {
    return -4 * temperature + 400;
}


function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function min_max(value, min, max) {
    if (Math.abs(value - min) < Math.abs(value - max)) {
        return min;
    } else {
        return max;
    }
}

function handle_input() {
    if (pressedKeys[' ']) heat();
}


function update_sensor() {
    // sensor = temperature;
    const length = temperature_history.array.length;
    sensor = temperature_history.array[length - 1 - Number(sensor_delay.value)];
}


function update_temperature() {
    temperature -= Number(cooling_factor.value);
    temperature = clamp(temperature, 0, 100);
    temperature_history.push(temperature);
}


function control() {
    if (sensor == undefined) return;

    const error = Number(target.value) - sensor;

    // porportional term
    const proportional = Number(K_p.value) * error;

    // intergral term
    let integral = 0;
    for (const error_t of error_history.array) integral += error_t * delta_time;
    integral *= Number(K_i.value);


    const signal = proportional + integral;

    let output = 0;
    if (heater_mode.value == 'all_or_nothing') {
        output = min_max(signal, 0, Number(max_heating_speed.value));
    } else if (heater_mode.value == 'gradual') {
        output = clamp(signal, 0, Number(max_heating_speed.value));
    }

    error_history.push(error);
    temperature += output;

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

    /* for (let index in temperature_history.array) {
        const temperature = temperature_history.array[length - 1 - index];
        ctx.lineTo(800 - (1 * index), 100 + get_height(temperature));
    } */

    for (let index = 0; index < Math.min(length, max_displayed_points); index++) {
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
    update_sensor()
    handle_input();
    control();
    update_temperature();
    draw();
    if (!pause) window.requestAnimationFrame(gameLoop);
}

gameLoop();