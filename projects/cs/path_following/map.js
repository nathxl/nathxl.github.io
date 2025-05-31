// relies on vector2d.js
// relies on astar.js

class MyMap {

    tile_size = 40;

    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 2, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    ];


    constructor() {

    }

    xy_to_cr(xy) {
        if (xy.x > 0 && xy.y > 0 && xy.x < this.tile_size * this.map[0].length && xy.y < this.tile_size * this.map.length) {
            const col = parseInt(xy.x / this.tile_size);
            const row = parseInt(xy.y / this.tile_size);
            return new Vector2D(col, row);
        }
        throw new Error("out of bounds");
    }

    place_block(xy) {
        const cr = this.xy_to_cr(xy);
        if (this.map[cr.y][cr.x] == 0) {
            this.map[cr.y][cr.x] = 1;
        } else {
            this.map[cr.y][cr.x] = 0;
        }
    }

    find_path_xy(xy_1, xy_2, heuristics_function, neighbors_function) {
        const start = this.xy_to_cr(xy_1);
        const target = this.xy_to_cr(xy_2);
        const path = this.find_path(start, target, this.get_collision_map(), heuristics_function, neighbors_function);
        const vector_path = [];
        for (const node of path) vector_path.push(new Vector2D(node.x * this.tile_size + this.tile_size / 2, node.y * this.tile_size + this.tile_size / 2));
        return vector_path;
    }

    find_path_cr(cr_1, cr_2, heuristics_function, neighbors_function) {
        const path = this.find_path(cr_1, cr_2, this.get_collision_map(), heuristics_function, neighbors_function);
        const vector_path = [];
        for (const node of path) vector_path.push(new Vector2D(node.x * this.tile_size + this.tile_size / 2, node.y * this.tile_size + this.tile_size / 2));
        return vector_path;
    }

    find_path(start, end, map, heuristics_function, neighbors_function) {
        let graph = []
        for (let row = 0; row < map.length; row++) {
            graph.push([])
            for (let col = 0; col < map[row].length; col++) {
                graph[row].push(new Node(col, row, map[row][col]));
            }
        }

        const graph_start = graph[start.y][start.x];
        const graph_end = graph[end.y][end.x];

        return a_star(graph, graph_start, graph_end, heuristics_function, neighbors_function);

    }

    get_collision_map() {
        const collision_map = [];
        for (const y in this.map) {
            const collision_row = [];
            for (const x in this.map[y]) {
                if (this.map[y][x] == 0 || this.map[y][x] == 2) {
                    collision_row.push(0);
                } else {
                    collision_row.push(1);
                }
            }
            collision_map.push(collision_row);
        }
        return collision_map;
    }

    draw(context) {
        for (let row in this.map) {
            for (let col in this.map[row]) {
                context.fillStyle = 'white';
                context.strokeStyle = 'lightgray';
                if (this.map[row][col] == 0) context.fillStyle = 'rgb(50,50,50)';
                if (this.map[row][col] == 2) context.fillStyle = 'violet';
                context.beginPath();
                context.rect(col * this.tile_size, row * this.tile_size, this.tile_size, this.tile_size);
                context.fill();
                context.stroke();
            }
        }
    }
}