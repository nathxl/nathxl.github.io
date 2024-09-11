class Wheel {
    constructor(position, angle) {
        this.position = position;
        this.angle = angle;
    }


    draw(context) {
        context.fillStyle = 'gray'

        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle);

        context.beginPath();
        context.lineTo(-5, -10);
        context.lineTo(+5, -10);
        context.lineTo(+5, +10);
        context.lineTo(-5, +10);
        context.closePath();
        context.fill();

        context.restore();
    }
}