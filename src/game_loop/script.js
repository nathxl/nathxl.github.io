const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let x = 0;
let y = 0;

function update() {
    x++;
    y++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.rect(x, y, 150, 100);
    ctx.fill();
}

function game_loop() {
    update();
    draw();
    window.requestAnimationFrame(game_loop);
}

game_loop();