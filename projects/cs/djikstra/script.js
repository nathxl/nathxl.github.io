// https://github.com/andrewhayward/dijkstra


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const move_button = document.getElementById("move_button");
const add_point_button = document.getElementById("add_point_button");
const add_arc_button = document.getElementById("add_arc_button");
const set_start_button = document.getElementById("set_start_button");
const set_target_button = document.getElementById("set_target_button");

const buttons = [move_button, add_point_button, add_arc_button, set_start_button, set_target_button];

const mouse_offset_x = canvas.offsetLeft + 1;
const mouse_offset_y = canvas.offsetTop + 1

let mode = 'move';

let mouse_down = false;
let mouse_pos = new Vector2D(0, 0);

const selected_nodes = new Set();
const selected_arcs = new Map();


let pressed_keys = new Map();
window.onkeyup = (e) => { pressed_keys.set(e.key, false) }
window.onkeydown = (e) => { pressed_keys.set(e.key, true) }


const graph = new Map();


const A = new Vector2D(70, 70);
const B = new Vector2D(50, 300);
const C = new Vector2D(300, 125);
const D = new Vector2D(200, 325);
const E = new Vector2D(500, 150);
const F = new Vector2D(300, 300);
const G = new Vector2D(400, 400);
const H = new Vector2D(550, 450);

graph.set(A, new Set([B, C]));
graph.set(B, new Set([D]));
graph.set(C, new Set([A, D, E]));
graph.set(D, new Set([A, F]));
graph.set(E, new Set([H]));
graph.set(F, new Set([E, G]));
graph.set(G, new Set([C, D, H]));
graph.set(H, new Set([G]));

let start = E;
let target = A;
let path = [];

const POINT_RADIUS = 7;
const POINT_SELECTION_DISTANCE = 13;
const ARC_SELECTION_DISTANCE = 7;



function point_in_polygon(point, polygon) {
    const num_vertices = polygon.length;
    const x = point.x;
    const y = point.y;
    let inside = false;
    let p1 = polygon[0];
    let p2;
    for (let i = 1; i <= num_vertices; i++) {
        p2 = polygon[i % num_vertices];
        if (y > Math.min(p1.y, p2.y)) {
            if (y <= Math.max(p1.y, p2.y)) {
                if (x <= Math.max(p1.x, p2.x)) {
                    const x_intersection = ((y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y) + p1.x;
                    if (p1.x === p2.x || x <= x_intersection) {
                        inside = !inside;
                    }
                }
            }
        }
        p1 = p2;
    }
    return inside;
}



function get_node_clicked() {
    for (const node of graph.keys()) {
        if (node.distance_to(mouse_pos) < POINT_SELECTION_DISTANCE) {
            return node;
        }
    }
    return null;
}


function get_arc_clicked() {
    for (const node of graph.keys()) {
        for (const target of graph.get(node)) {
            const direction = node.substract(target).unit();
            const normal = direction.normal().unit();
            const a = node.add(direction.multiply(-POINT_SELECTION_DISTANCE)).add(normal.multiply(+ARC_SELECTION_DISTANCE));
            const b = target.add(direction.multiply(+POINT_SELECTION_DISTANCE)).add(normal.multiply(+ARC_SELECTION_DISTANCE));
            const c = target.add(direction.multiply(+POINT_SELECTION_DISTANCE)).add(normal.multiply(-ARC_SELECTION_DISTANCE))
            const d = node.add(direction.multiply(-POINT_SELECTION_DISTANCE)).add(normal.multiply(-ARC_SELECTION_DISTANCE))
            const polygon = [a, b, c, d];
            if (point_in_polygon(mouse_pos, polygon)) {
                return [node, target];
            }
        }
    }
    return null;
}



function is_arc_in_selection(arc) {
    if (arc == null) return false;
    if (!selected_arcs.has(arc[0])) {
        return false;
    } else {
        if (!selected_arcs.get(arc[0]).has(arc[1])) {
            return false;
        }
    }
    return true;
}


function add_arc_to_selection(arc) {
    if (selected_arcs.has(arc[0])) {
        selected_arcs.get(arc[0]).add(arc[1]);
    } else {
        selected_arcs.set(arc[0], new Set([arc[1]]));
    }
}

function handle_selection_ctrl_depressed(selected_node, selected_arc) {
    const node_selected = selected_node != null;
    const node_reselected = selected_nodes.has(selected_node);
    const arc_selected = selected_arc != null;
    const arc_reselected = is_arc_in_selection(selected_arc);

    if (node_selected) {
        if (!node_reselected) {
            selected_nodes.clear();
            selected_arcs.clear();
            selected_nodes.add(selected_node);
        }
        return;
    }

    if (arc_selected) {
        if (!arc_reselected) {
            selected_nodes.clear();
            selected_arcs.clear();
            add_arc_to_selection(selected_arc);
        }
        return;
    }

    selected_nodes.clear();
    selected_arcs.clear();
}


function handle_selection_ctrl_pressed(selected_node, selected_arc) {
    if (mode == 'move') {
        if (selected_node != null) {
            selected_nodes.add(selected_node);
        }
        if (selected_arc != null) {
            add_arc_to_selection(selected_arc);
        }
    }
}



document.onkeydown = (e) => {
    if (e.key == 'Delete') {

        // delete nodes
        for (const arc_start of graph.keys()) {
            if (selected_nodes.has(arc_start)) {
                graph.delete(arc_start);
            } else {
                for (const arc_end of graph.get(arc_start)) {
                    if (selected_nodes.has(arc_end)) {
                        graph.get(arc_start).delete(arc_end);
                    }
                }
            }
        }

        // delete arcs
        for (const arc_start of graph.keys()) {
            if (selected_arcs.has(arc_start)) {
                for (const arc_end of graph.get(arc_start)) {
                    if (selected_arcs.get(arc_start).has(arc_end)) {
                        graph.get(arc_start).delete(arc_end);
                    }
                }
            }
        }

        if (selected_nodes.has(start)) { start = null; }
        if (selected_nodes.has(target)) { target = null; }

        selected_nodes.clear();
        selected_arcs.clear();

        path = [];
        find_path();
    }
}


canvas.addEventListener("mousedown", (event) => {
    mouse_down = true;
    mouse_pos = new Vector2D(event.x - mouse_offset_x, event.y - mouse_offset_y);

    const selected_node = get_node_clicked();
    const selected_arc = get_arc_clicked();

    if (!pressed_keys.get('Control')) {
        handle_selection_ctrl_depressed(selected_node, selected_arc);
    } else {
        handle_selection_ctrl_pressed(selected_node, selected_arc)
    }

    if (mode == 'add_point' && selected_node == null) {
        let new_point = new Vector2D(mouse_pos.x, mouse_pos.y);
        selected_nodes.add(new_point);
        graph.set(new_point, new Set());
    }

    if (mode == 'add_arc' && selected_node == null) {
        let new_point = new Vector2D(mouse_pos.x, mouse_pos.y);
        selected_nodes.add(new_point);
        graph.set(new_point, new Set());
    }

    if (mode == 'set_start' && selected_node != null) {
        start = selected_node;
        find_path();
    }

    if (mode == 'set_target' && selected_node != null) {
        target = selected_node;
        find_path();
    }

});


canvas.addEventListener("mouseup", (event) => {
    mouse_down = false;

    if (mode == 'add_arc') {
        const start_node = selected_nodes.values().next().value;
        let target_node = null;

        for (const node of graph.keys()) {
            if (node.distance_to(mouse_pos) < POINT_SELECTION_DISTANCE) {
                target_node = node;
            }
        }

        if (target_node == null) {
            let new_point = new Vector2D(mouse_pos.x, mouse_pos.y);
            target_node = new_point;
            graph.set(new_point, new Set());
        }

        graph.get(start_node).add(target_node);
        selected_nodes.clear();
        find_path();
    }
});


canvas.addEventListener("mousemove", (event) => {
    let new_mouse_pos = new Vector2D(event.x - mouse_offset_x, event.y - mouse_offset_y);
    if (mouse_down) {
        if (mode != 'add_arc') {
            const delta = new_mouse_pos.substract(mouse_pos);
            const nodes_to_move = new Set(selected_nodes);
            for (const arc_start of selected_arcs.keys()) {
                nodes_to_move.add(arc_start);
                for (const arc_end of selected_arcs.get(arc_start)) {
                    nodes_to_move.add(arc_end);
                }
            }
            for (let node of nodes_to_move) {
                node.x += delta.x;
                node.y += delta.y;
            }
            if (nodes_to_move.size != 0) {
                find_path();
            }
        }
    };
    mouse_pos = new_mouse_pos;
});


function depress_all_buttons() {
    for (const element of buttons) {
        element.classList.remove('pressed');
        element.classList.add('depressed');
    }
}

function activate_add_point_mode() {
    mode = 'add_point';
    selected_nodes.clear();
    depress_all_buttons();
    add_point_button.classList.remove('depressed');
    add_point_button.classList.add('pressed');
}

function activate_add_arc_mode() {
    mode = 'add_arc';
    selected_nodes.clear();
    depress_all_buttons();
    add_arc_button.classList.remove('depressed');
    add_arc_button.classList.add('pressed');
}

function activate_set_start_mode() {
    mode = 'set_start';
    selected_nodes.clear();
    depress_all_buttons();
    set_start_button.classList.remove('depressed');
    set_start_button.classList.add('pressed');
}

function activate_set_target_mode() {
    mode = 'set_target';
    selected_nodes.clear();
    depress_all_buttons();
    set_target_button.classList.remove('depressed');
    set_target_button.classList.add('pressed');
}

function activate_move_mode() {
    mode = 'move';
    depress_all_buttons();
    move_button.classList.remove('depressed');
    move_button.classList.add('pressed');
}



function drawTriangle(target, direction, width, height, color) {
    const base_1 = target.add(direction.multiply(- height).add(direction.normal().multiply(width / 2)));
    const base_2 = target.add(direction.multiply(- height).add(direction.normal().multiply(- width / 2)));
    const top = target.add(direction.multiply(1));

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.moveTo(base_1.x, base_1.y);
    ctx.lineTo(base_2.x, base_2.y);
    ctx.lineTo(top.x, top.y);
    ctx.lineTo(base_1.x, base_1.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}


function drawArrow(v1, v2, color, line_width) {
    const v = v2.substract(v1);
    const distance = v.magnitude();
    const direction = v.unit();

    const start = v1.add(direction.multiply(+ POINT_RADIUS));;
    const stop = v2.add(direction.multiply(- POINT_RADIUS));

    ctx.lineWidth = line_width;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(stop.x, stop.y);
    ctx.stroke();
    drawTriangle(stop, direction, 8, 10);
}


function draw() {
    clear_canvas();
    draw_arcs();
    draw_path();
    draw_nodes();
    draw_start();
    draw_target();
    draw_temp_arc();
    draw_selected_nodes();
    draw_selected_edges();
    // draw_boxes();
}

function clear_canvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function draw_selected_edges() {
    for (const vector of selected_arcs.keys()) {
        for (const target of selected_arcs.get(vector)) {
            drawArrow(vector, target, 'blue', 2);
        }
    }
}


function draw_boxes() {
    for (const node of graph.keys()) {
        for (const target of graph.get(node)) {
            const direction = node.substract(target).unit();
            const normal = direction.normal().unit();

            const a = node.add(direction.multiply(-POINT_SELECTION_DISTANCE)).add(normal.multiply(+ARC_SELECTION_DISTANCE));
            const b = target.add(direction.multiply(+POINT_SELECTION_DISTANCE)).add(normal.multiply(+ARC_SELECTION_DISTANCE));
            const c = target.add(direction.multiply(+POINT_SELECTION_DISTANCE)).add(normal.multiply(-ARC_SELECTION_DISTANCE));
            const d = node.add(direction.multiply(-POINT_SELECTION_DISTANCE)).add(normal.multiply(-ARC_SELECTION_DISTANCE));

            ctx.lineWidth = 1;
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(c.x, c.y);
            ctx.lineTo(d.x, d.y);
            ctx.closePath();
            ctx.stroke();
        }
    }
}


function draw_start() {
    if (start == null) return;
    ctx.lineWidth = 2;
    ctx.fillStyle = 'DodgerBlue';
    ctx.fillStyle = 'LimeGreen';
    ctx.beginPath();
    ctx.arc(start.x, start.y, POINT_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
}


function draw_target() {
    if (target == null) return;
    ctx.lineWidth = 2;
    ctx.fillStyle = 'Crimson';
    ctx.beginPath();
    ctx.arc(target.x, target.y, POINT_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
}


function draw_nodes() {
    for (const node of graph.keys()) {
        if (node != start && node != target) {
            ctx.fillStyle = 'gray';
            ctx.beginPath();
            ctx.arc(node.x, node.y, POINT_RADIUS, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

function draw_arcs() {
    for (const vector of graph.keys()) {
        for (const target of graph.get(vector)) {
            drawArrow(vector, target, 'LightGrey', 2);
        }
    }
}


function draw_path() {
    for (let i = 0; i < path.length - 1; i++) {
        ctx.lineWidth = 3;
        drawArrow(path[i], path[i + 1], 'LightGreen', 3);
    }
}


function draw_temp_arc() {
    if (mode == 'add_arc' && mouse_down && selected_nodes.size > 0) {
        const selected_node = selected_nodes.values().next().value;
        drawArrow(selected_node, mouse_pos, 'LightGrey', 2);
    }
}

function draw_selected_nodes() {
    for (const vector of selected_nodes) {
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(vector.x, vector.y, POINT_SELECTION_DISTANCE, 0, 2 * Math.PI);
        ctx.stroke();
    }
}


function find_path() {
    if (start == null || target == null) return;
    path = findShortestPath(graph, start, target);
}



function main_loop() {
    draw();
    window.requestAnimationFrame(main_loop);
}


find_path();
main_loop();