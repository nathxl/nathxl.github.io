const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


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


let temperature = 50;
let temperature_history = new MaxLengthArray(500);


let pressedKeys = {};
document.onkeydown = (e) => { pressedKeys[e.key] = true; }
document.onkeyup = (e) => { pressedKeys[e.key] = false; }


function get_height(temperature) {
    return -4 * temperature + 400;
}


function handle_input() {
    if (pressedKeys[' ']) temperature += 0.5;
}


function update() {
    temperature -= 0.1;
    if (temperature < 0) {
        temperature = 0;
    }
    if (temperature > 100) {
        temperature = 100;
    }
    temperature_history.push(temperature);
}


function draw_gauge() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.rect(100, 100, 50, 400);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.rect(100, 100, 50, get_height(temperature));
    ctx.fill();
    ctx.stroke();

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
    for (let index in temperature_history.array) {
        const temperature = temperature_history.array[length - 1 - index];
        ctx.lineTo(800 - (1 * index), 100 + get_height(temperature));
    }
    ctx.stroke();

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

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handle_input();
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();