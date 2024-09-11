const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


const grad = ctx.createLinearGradient(0, 0, 0, 400);
grad.addColorStop(0, "red");
grad.addColorStop(1, "LightGreen");

let temperature = 50;


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
}

function draw() {
    ctx.fillStyle = grad;
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
    ctx.fillStyle = 'black';
    ctx.font = "20px serif";
    ctx.fillText(temperature.toFixed(2), 155, 108 + get_height(temperature));
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handle_input();
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();