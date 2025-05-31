

function draw_vector(context, start, vector, color) {
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(start.x + vector.x, start.y + vector.y);
    context.stroke();

    context.beginPath();
    context.arc(start.x + vector.x, start.y + vector.y, 2, 0, 2 * Math.PI);
    context.stroke();
}