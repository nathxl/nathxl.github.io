class Player {
    radius = 20;
    mu = 0.01;
    mass = 5;
    position = new Vector2D(0, 0);
    velocity = new Vector2D(0, 0);

    current_node = 0;
    path = [];

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

    limit_velocity() {
        const limit = 5;
        if (this.velocity.magnitude() > limit) {
            this.velocity = this.velocity.unit().multiply(limit);
        }
    }

    follow_path(delta_time) {
        // for (const i in this.path) console.log(i);
        if (this.path.length == 0) return;
        let node = this.path[this.current_node];
        if (this.position.distance_to(node) < 10) this.current_node++;
        if (this.current_node >= this.path.length) {
            this.path = [];
            return;
        }
        const direction = node.substract(this.position).unit();
        if (this.velocity.magnitude() < 1.5) {
            this.apply_force(direction.multiply(1), delta_time);
        }
    }

    update(delta_time) {

        this.limit_velocity();
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