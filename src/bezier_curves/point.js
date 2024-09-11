class Point {
    radius = 7;
    selected = false;

    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw(ctx) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    select(x, y) {
        const distance = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
        if (distance <= this.radius) {
            this.selected = true;
        }
    }

    unselect() {
        this.selected = false;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }
}