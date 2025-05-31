class Queue {
    color = "lightgray";
    theta = 145;

    draw(ctx, ballPos, mousePos) {
        ctx.beginPath();
        ctx.moveTo(ballPos.x, ballPos.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    constructor () {

    }
}