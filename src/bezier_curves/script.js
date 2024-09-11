const slider = document.getElementById("line_width_slider");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const mouse_offset_x = canvas.offsetLeft + 1;
const mouse_offset_y = canvas.offsetTop + 1

let mouse_pressed = false;
let points = [];




canvas.addEventListener("mousemove", (event) => {
    if (!mouse_pressed) return;
    const x = event.x - mouse_offset_x;
    const y = event.y - mouse_offset_y;
    for (point of points) {
        if (point.selected) point.move(x, y)
    }
});

canvas.addEventListener("mousedown", (event) => {
    mouse_pressed = true;
    const x = event.x - mouse_offset_x;
    const y = event.y - mouse_offset_y;
    for (point of points) {
        point.select(x, y);
    }
});


canvas.addEventListener("mouseup", (event) => {
    mouse_pressed = false;
    for (point of points) {
        point.unselect();
    }
});


let p0 = new Point(50, 250, 'green');
let cp1 = new Point(150, 150, 'blue');
let cp2 = new Point(250, 300, 'orange');
let p1 = new Point(350, 200, 'red');
let cp3 = new Point(450, 150, 'blue');
let cp4 = new Point(450, 300, 'orange');
let p3 = new Point(550, 200, 'red');

points.push(p0);
points.push(cp1);
points.push(cp2);
points.push(p1);
points.push(cp3);
points.push(cp4);
points.push(p3);


function update() {

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    ctx.lineWidth = slider.value;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p1.x, p1.y);
    ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, p3.x, p3.y);
    ctx.stroke();

    for (point of points) {
        point.draw(ctx);
    }
}


function gameLoop() {
    update()
    draw();
    window.requestAnimationFrame(gameLoop);
}


gameLoop()