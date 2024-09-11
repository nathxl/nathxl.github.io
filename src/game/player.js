class Player {
    radius = 20;

    mu = 0.01;

    mass = 5;
    position = new Vector2D(0, 0);
    velocity = new Vector2D(0, 0);

    constructor(position) {
        this.position = position;
    }

    apply_force(force, delta_time) {
        const acceleration = force.divide(this.mass);
        this.velocity = this.velocity.add(acceleration.multiply(delta_time));
    }

    apply_friction(delta_time) {
        const friction = this.velocity.unit().multiply(-1 * this.mu * this.mass * 9.81);
        const acceleration = friction.divide(this.mass);
        const delta_v = acceleration.multiply(delta_time);
        if (this.velocity.magnitude() < delta_v.magnitude()) {
            this.velocity = new Vector2D(0, 0);
        } else {
            this.velocity = this.velocity.add(delta_v);
        }
    }

    update(delta_time) {
        this.position = this.position.add(this.velocity.multiply(delta_time));
        this.apply_friction(delta_time);
    }

    draw(context) {
        context.strokeStyle = 'black';
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
    }
}