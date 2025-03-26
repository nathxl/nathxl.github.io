// inspired from https://github.com/andrewhayward/dijkstra/blob/master/graph.js

function sorter(a, b) {
    return parseFloat(a) - parseFloat(b);
}


function findPaths(map, start, end) {

    let node_costs = new Map();
    node_costs.set(start, 0);
    let open_paths_cost = new Map();
    open_paths_cost.set(0, [start]);
    let predecessors = new Map();

    while (open_paths_cost.size > 0) {
        const costs = Array.from(open_paths_cost.keys()).sort(sorter);
        const smallest_cost = costs[0];
        const bucket = open_paths_cost.get(smallest_cost);
        const node = bucket.shift();
        const currentCost = parseFloat(smallest_cost);
        // const adjacentNodes = map.get(node) || new Map();
        const adjacentNodes = map.get(node) || new Set();

        if (bucket.length <= 0) open_paths_cost.delete(smallest_cost);

        for (const vertex of adjacentNodes) {
            const cost = node.distanceTo(vertex);

            const totalCost = cost + currentCost;
            const vertexCost = node_costs.get(vertex);
            if ((vertexCost === undefined) || (vertexCost > totalCost)) {
                node_costs.set(vertex, totalCost);
                // if (!open_paths_cost.has(totalCost)) open_paths_cost.set(totalCost, []);
                const temp = open_paths_cost.get(totalCost) || [];
                temp.push(vertex);
                open_paths_cost.set(totalCost, temp);
                predecessors.set(vertex, node);
            }
        }
    }

    if (node_costs.get(end) === undefined) {
        return null;
    } else {
        return predecessors;
    }

}



function extractShortest(predecessors, end) {
    let nodes = [];
    let u = end;

    while (u != undefined) {
        nodes.push(u);
        u = predecessors.get(u);
    }


    nodes.reverse();
    return nodes;
}


function findShortestPath(map, start, end) {
    const predecessors = findPaths(map, start, end);
    if (predecessors) {
        return extractShortest(predecessors, end);
    } else {
        return [];
    }
}