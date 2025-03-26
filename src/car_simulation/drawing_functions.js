/* function draw_polygon(context, nodes, center, angle) {
    context.fillStyle = 'red';
    context.strokeStyle = 'black';

    // translate + rotate context
    context.save();
    context.translate(center.x, center.y);
    context.rotate(angle);

    // draw polygon
    context.beginPath();
    for (const node of nodes) {
        context.lineTo(node.x, node.y);
    }
    context.closePath();
    context.fill();

    // restore context
    context.restore();

    // draw center
    context.beginPath();
    context.arc(center.x, center.y, 5, 0, 2 * Math.PI);
    context.stroke();
} */

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