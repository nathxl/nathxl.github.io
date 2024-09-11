class Particle {
    r = new Vector(0, 0);
    v = new Vector(0, 0);

    m = 1;

    radius = 20;

    constructor (r, m) {
        this.r = r;
        this.m = m;
    }

    move(dt) {
        this.r = this.r.add(this.v.multiply(dt));
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.r.x, this.r.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}