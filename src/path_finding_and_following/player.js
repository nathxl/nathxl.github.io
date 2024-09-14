class Player {
    radius = 20;
    mu = 1;
    mass = 1;
    position = new Vector2D(0, 0);
    velocity = new Vector2D(0, 0);

    max_speed = 100;

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
        this.velocity = this.velocity.multiply(0.94);
    }



    follow_path(delta_time) {
        // for (const i in this.path) console.log(i);
        if (this.path.length == 0) return;
        let node = this.path[this.current_node];
        if (this.position.distance_to(node) < 10) this.current_node++;
        if (this.current_node >= this.path.length) {
            this.current_node = 0;
            this.path = [];
            return;
        }
        const direction = node.substract(this.position).unit();
        this.apply_force(direction.multiply(300), delta_time);

        this.update(delta_time);
    }

    update(delta_time) {
        this.apply_friction(delta_time);
        this.position = this.position.add(this.velocity.multiply(delta_time));
    }

    draw_path(context, tile_size) {
        if (this.path.length == 0) return;
    
        // draw path
        context.strokeStyle = 'blue';
        context.beginPath();
        for (const node of this.path) {
            context.lineTo(node.x, node.y);
        }
        context.stroke();
    
        // draw first element
        const first_node = this.path[0];
        context.fillStyle = 'green';
        context.beginPath();
        context.arc(first_node.x, first_node.y, 10, 0, 2 * Math.PI);
        context.fill();
    
        // draw last element
        const last_node = this.path[this.path.length - 1]
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(last_node.x, last_node.y, 10, 0, 2 * Math.PI);
        context.fill();
    }

    draw(context, tile_size) {
        this.draw_path(context, tile_size);
        context.strokeStyle = 'black';
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
    }
}