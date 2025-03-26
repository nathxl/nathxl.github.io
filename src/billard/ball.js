class Ball {
    r = new Vector(0, 0);
    v = new Vector(0, 0);
    a = new Vector(0, 0);
    color = "red";

    acceleration = 3;
    friction = 0.01;

    constructor(x, y, radius, color) {
        this.r = new Vector(x, y);
        this.radius = radius;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.r.x, this.r.y, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    display(ctx) {
        this.v.draw(500, 500, 10, "green");
        this.a.draw(500, 500, 50, "blue");
        this.a.normal().draw(500, 500, 50, "black");
        ctx.beginPath();
        ctx.arc(500, 500, 50, 0, 2 * Math.PI);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    hit(hitFactor, mousePos) {
        const hitDirection = mousePos.subtr(this.r).unit();
        const hitVector = hitDirection.mult(hitFactor);
        this.v = this.v.add(hitVector);

    }

    reposition() {

        if (this.r.x < this.radius) {
            this.r.x = this.radius;
            this.v.x = - this.v.x;
        }

        if (this.r.y < this.radius) {
            this.r.y = this.radius;
            this.v.y = - this.v.y;
        }

        if (this.r.x > 1200 - this.radius) {
            this.r.x = 1200 - this.radius;
            this.v.x = - this.v.x;
        }

        if (this.r.y > 600 - this.radius) {
            this.r.y = 600 - this.radius;
            this.v.y = - this.v.y;
        }

        this.a = this.a.unit().mult(this.acceleration);
        this.v = this.v.add(this.a).mult(1 - this.friction);
        this.r = this.r.add(this.v);
    }
}