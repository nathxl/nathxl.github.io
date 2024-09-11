class Node {
    radius = 10;

    constructor(position) {
        this.position = position;
    }

    is_targeted(x, y) {
        const distance = Math.sqrt((this.position.x - x) ** 2 + (this.position.y - y) ** 2);
        if (distance <= this.radius) return true;
        return false;
    }

    distanceTo(node) {
        return this.position.distanceTo(node.position);
    }

    move(dx, dy) {
        this.position.x += dx;
        this.position.y += dy;
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    clear_surroundings() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    draw_selection(ctx) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * 1.5, 0, 2 * Math.PI);
        ctx.stroke();
    }
}