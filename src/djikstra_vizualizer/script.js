// https://github.com/andrewhayward/dijkstra

const mode = document.getElementById("mode");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const mouse_offset_x = canvas.offsetLeft + 1;
const mouse_offset_y = canvas.offsetTop + 1

let mouse_down = false;
let mouse_pos = new Vector(0, 0);



const graph = new Map();

const A = new Node(new Vector(70, 70));
const B = new Node(new Vector(350, 70));
const C = new Node(new Vector(70, 250));
const D = new Node(new Vector(150, 150));

graph.set(A, new Set([B, C]));
graph.set(B, new Set([D, A]));
graph.set(C, new Set([D]));
graph.set(D, new Set());


let start;
let end;
let path = [];
let selected_nodes = new Set();



canvas.addEventListener("mousedown", (event) => {
    mouse_down = true;
    const x = event.x - mouse_offset_x;
    const y = event.y - mouse_offset_y;
    if (mode.value == 'SELECTION') {
        let node_selected = false;
        for (const node of graph.keys()) {
            if (node.is_targeted(x, y)) {
                node_selected = true;
                selected_nodes.add(node);
            }
        }
        if (!node_selected) {
            selected_nodes.clear();
        }
    } else if (mode.value == 'ADD_NODE') {
        graph.set(new Node(new Vector(x, y)), new Set());
    }
});


canvas.addEventListener("mouseup", (event) => {
    mouse_down = false;
});


canvas.addEventListener("mousemove", (event) => {
    if (mouse_down) {
        if (mode.value == 'MOVE') {
            const dx = event.x - mouse_pos.x;
            const dy = event.y - mouse_pos.y;
            for (const node of selected_nodes) {
                node.move(dx, dy);
            }
        };
    };
    mouse_pos.x = event.x;
    mouse_pos.y = event.y;
});




function set_start() {
    if (selected_nodes.size != 1) return;
    const [selected] = selected_nodes;
    start = selected;
}

function set_end() {
    if (selected_nodes.size != 1) return;
    const [selected] = selected_nodes;
    end = selected;
}

function find_path() {
    path = findShortestPath(graph, start, end);
}

function add_edge() {
    if (selected_nodes.size != 2) return;
    const [first, second] = selected_nodes;
    graph.get(first).add(second)
}




function drawTriangle(center, direction, width, height) {
    const base_1 = center.add(direction.multiply(- height / 2).add(direction.normal().multiply(width / 2)));
    const base_2 = center.add(direction.multiply(- height / 2).add(direction.normal().multiply(- width / 2)));
    const top = center.add(direction.multiply(height / 2));
    ctx.beginPath();
    ctx.moveTo(base_1.x, base_1.y);
    ctx.lineTo(base_2.x, base_2.y);
    ctx.lineTo(top.x, top.y);
    ctx.lineTo(base_1.x, base_1.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}


function drawArrow(v1, v2, offset) {
    const v = v2.substract(v1);
    const distance = v.magnitude();
    const direction = v.unit();
    const normal = direction.normal().multiply(-1);
    const mid_point = v1.add(direction.multiply(distance / 2)).add(normal.multiply(offset));
    const start = v1.add(normal.multiply(offset));
    const stop = v2.add(normal.multiply(offset));
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(stop.x, stop.y);
    ctx.stroke();
    drawTriangle(mid_point, direction, 10, 10);
}





function drawPath(path) {
    ctx.beginPath();
    let previous_node = path[0];
    for (let i = 1; i < path.length; i++) {
        drawArrow(previous_node.position, path[i].position, 5);
        previous_node = path[i];
    }
    ctx.stroke();
}



function drawGraph(graph, path) {
    // draw edges
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    for (const node of graph.keys()) {
        for (const target of graph.get(node)) {
            drawArrow(node.position, target.position, 5);
        }
    }
    
    // draw path
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';
    drawPath(path);

    // make white space to draw node
    for (const node of graph.keys()) {
        node.clear_surroundings();
    }

    // draw nodes
    for (const node of graph.keys()) {
        node.draw(ctx);
    }
}


function draw_selected_nodes() {
    for (const node of selected_nodes) {
        node.draw_selection(ctx);
    }
}


function update() {

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGraph(graph, path);
    draw_selected_nodes();
}


function gameLoop() {
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
}



gameLoop();

