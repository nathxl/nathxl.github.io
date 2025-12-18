class Goto {

    initialized = false;
    terminate = false;
    path = [];


    constructor(player, target, map, heuristics_function, neighbors_function) {
        this.player = player;
        this.target = target;
        this.map = map;
        this.heuristics_function = heuristics_function;
        this.neighbors_function = neighbors_function;
    }

    init() {
        const start = this.map.xy_to_cr(this.player.position);
        this.path = this.map.find_path_cr(start, this.target, this.heuristics_function, this.neighbors_function);

        // anti back-and-forth kick
        if (this.path.length >= 2) {
            const n0 = this.path[0];
            const n1 = this.path[1];
            const x = this.player.position.x;
            const y = this.player.position.y;

            if ((x > Math.min(n0.x, n1.x) && x < Math.max(n0.x, n1.x)) || (y > Math.min(n0.y, n1.y) && y < Math.max(n0.y, n1.y))) {
                this.path.shift();
            }
        }

        this.initialized = true;
    }

    execute() {
        const remainder = this.player.speed;
        this.follow_path(remainder);
    }


    follow_path(remainder) {
        if (this.path.length == 0) {
            this.terminate = true;
            return;
        };
        const node = this.path[0];
        const vector_to_next_node = node.substract(this.player.position);
        if (vector_to_next_node.magnitude() >= this.player.speed) {
            this.player.position = this.player.position.add(vector_to_next_node.unit().multiply(this.player.speed));
        } else {
            this.player.position = this.player.position.add(vector_to_next_node);
            remainder = this.player.speed - vector_to_next_node.magnitude();
            this.path.shift();
            this.follow_path(remainder);
        }
    }

    draw(context) {
        if (this.initialized) {
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
        } else {
            context.fillStyle = 'yellow';
            context.beginPath();
            context.arc(this.target.x * this.map.tile_size + this.map.tile_size / 2, this.target.y * this.map.tile_size + this.map.tile_size / 2, 10, 0, 2 * Math.PI);
            context.fill();
        }
    }
}