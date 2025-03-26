const line_width_slider = document.getElementById("line_width_slider");
const circle_radius_slider = document.getElementById("circle_radius_slider");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const mouse_offset_x = canvas.offsetLeft + 1;
const mouse_offset_y = canvas.offsetTop + 1


let line_width = line_width_slider.value;
let circle_radius = circle_radius_slider.value;
let mouse_pressed = false;
let points = [];

let p0 = new Point(50, 250, 'green');
let p1 = new Point(350, 200, 'red');

let p2 = new Point(250, 50, 'green');
let p3 = new Point(200, 350, 'red');


points.push(p0);
points.push(p1);
points.push(p2);
points.push(p3);


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



function update() {
    line_width = line_width_slider.value;
    circle_radius = circle_radius_slider.value;
}

function draw() {
    const p_i = intersection_between_4_points(p0, p1, p2, p3);
    const [i_0, i_1] = intersection_2_points_circle(p0, p1, p_i, circle_radius);
    const [i_2, i_3] = intersection_2_points_circle(p2, p3, p_i, circle_radius);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = line_width;
    ctx.strokeStyle = 'black';

    // Draw lines
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();

    // Draw Bezier curves
    ctx.beginPath();
    ctx.moveTo(i_0.x, i_0.y);
    ctx.bezierCurveTo(p_i.x, p_i.y, p_i.x, p_i.y, i_2.x, i_2.y);
    ctx.bezierCurveTo(p_i.x, p_i.y, p_i.x, p_i.y, i_1.x, i_1.y);
    ctx.bezierCurveTo(p_i.x, p_i.y, p_i.x, p_i.y, i_3.x, i_3.y);
    ctx.bezierCurveTo(p_i.x, p_i.y, p_i.x, p_i.y, i_0.x, i_0.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw Points
    for (point of points) {
        point.draw(ctx);
    }

    // Draw circle
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.arc(p_i.x, p_i.y, circle_radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw intersections
    p_i.draw(ctx);
    i_0.draw(ctx);
    i_1.draw(ctx);
    i_2.draw(ctx);
    i_3.draw(ctx);    
    
}


function gameLoop() {
    update()
    draw();
    window.requestAnimationFrame(gameLoop);
}


gameLoop();