class Wheel {

    MAX_ANGLE = Math.PI / 4;
    width = 4;
    length = 8;
    turn_rate = 0.06;
    recenter_rate = 0.03;

    constructor(position, angle, width, length) {
        this.position = position;
        this.angle = angle;
        this.width = width;
        this.length = length;
    }

    turn(direction) {
        this.angle += direction * this.turn_rate;
        if (this.angle < - this.MAX_ANGLE) {
            this.angle = - this.MAX_ANGLE;
        } else if (this.angle > this.MAX_ANGLE) {
            this.angle = this.MAX_ANGLE;
        }
    }

    recenter() {
        if (this.angle > 0) {
            this.angle -= this.recenter_rate;
        } else if (this.angle < 0) {
            this.angle += this.recenter_rate;
        }
    }

    draw(context) {
        context.strokeStyle = 'black';
        context.fillStyle = 'rgb(50,50,50)';

        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle);

        context.beginPath();
        context.lineTo(-this.width, -this.length);
        context.lineTo(+this.width, -this.length);
        context.lineTo(+this.width, +this.length);
        context.lineTo(-this.width, +this.length);
        context.closePath();
        context.fill();
        context.stroke();

        context.restore();
    }
}