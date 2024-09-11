function sorter(a, b) {
    return parseFloat(a) - parseFloat(b);
}


function findPaths(map, start, end) {

    let costs = new Map([[start, 0]]);
    let open = new Map([[0, [start]]]);
    let predecessors = new Map();

    while (open.size > 0) {
        const keys = Array.from(open.keys()).sort(sorter);
        const key = keys[0];
        const bucket = open.get(key);
        const node = bucket.shift();
        const currentCost = parseFloat(key);
        const adjacentNodes = map.get(node) || new Map();

        if (bucket.length <= 0) open.delete(key);

        for (const vertex of adjacentNodes) {
            const cost = node.distanceTo(vertex);

            const totalCost = cost + currentCost;
            const vertexCost = costs.get(vertex);
            if ((vertexCost === undefined) || (vertexCost > totalCost)) {
                costs.set(vertex, totalCost);
                if (!open.has(totalCost)) open.set(totalCost, []);
                let temp = open.get(totalCost);
                temp.push(vertex);
                open.set(totalCost, temp);
                predecessors.set(vertex, node);
            }
        }
    }

    if (costs.get(end) === undefined) {
        return null;
    } else {
        return predecessors;
    }

}



function extractShortest(predecessors, end) {
    let nodes = [];
    let u = end;

    while (u !== undefined) {
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