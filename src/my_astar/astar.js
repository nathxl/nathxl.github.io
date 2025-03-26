// A* implementation from the pseudo code found here :
// https://en.wikipedia.org/wiki/A*_search_algorithm

// Heuristic function :
// Taxicab/Manhattan distance for 4-way grid map
// Chebyshev distance for 8-way grid map


class Node {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    }

    distance_to(node) {
        return Math.sqrt((node.x - this.x) ** 2 + (node.y - this.y) ** 2);
    }
}


// custom map where default values are Infinity
class CustomMap {
    constructor() {
        this.map = new Map();
    }

    set(key, value) {
        this.map.set(key, value);
    }

    get(key) {
        return this.map.has(key) ? this.map.get(key) : Infinity;
    }
}


function manhattan_distance(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function chebyshev_distance(p1, p2) {
    return Math.max(Math.abs(p2.x - p1.x), Math.abs(p2.y - p1.y));
}


function reconstruct_path(cameFrom, current) {
    let current_node = current;
    total_path = [current_node];
    while (cameFrom.has(current_node)) {
        current_node = cameFrom.get(current_node);
        total_path.push(current_node);
    }
    return total_path.reverse();
}

function get_4_neighbors(graph, node) {
    const col = node.x;
    const row = node.y;

    const neighbors = [];

    if (col + 1 < graph[row].length && graph[row][col + 1].value != 0) {
        neighbors.push(graph[row][col + 1]);
    }
    if (col - 1 >= 0 && graph[row][col - 1].value != 0) {
        neighbors.push(graph[row][col - 1]);
    }
    if (row + 1 < graph.length && graph[row + 1][col].value != 0) {
        neighbors.push(graph[row + 1][col]);
    }
    if (row - 1 >= 0 && graph[row - 1][col].value != 0) {
        neighbors.push(graph[row - 1][col]);
    }
    return neighbors;
}


function get_8_neighbors_A(graph, node) {
    const col = node.x;
    const row = node.y;

    const neighbors = [];

    if (col + 1 < graph[row].length && graph[row][col + 1].value != 0) {
        neighbors.push(graph[row][col + 1]);
    }
    if (col - 1 >= 0 && graph[row][col - 1].value != 0) {
        neighbors.push(graph[row][col - 1]);
    }

    if (row + 1 < graph.length) {
        if (graph[row + 1][col].value != 0) {
            neighbors.push(graph[row + 1][col]);
        }
        if (col - 1 >= 0 && graph[row + 1][col - 1].value != 0) {
            neighbors.push(graph[row + 1][col - 1]);
        }
        if (col + 1 < graph[row + 1].length && graph[row + 1][col + 1].value != 0) {
            neighbors.push(graph[row + 1][col + 1]);
        }
    }

    if (row - 1 >= 0) {
        if (graph[row - 1][col].value != 0) {
            neighbors.push(graph[row - 1][col]);
        }
        if (col - 1 >= 0 && graph[row - 1][col - 1].value != 0) {
            neighbors.push(graph[row - 1][col - 1]);
        }
        if (col + 1 < graph[row - 1].length && graph[row - 1][col + 1].value != 0) {
            neighbors.push(graph[row - 1][col + 1]);
        }
    }
    return neighbors;
}





function get_8_neighbors_B(graph, node) {
    const col = node.x;
    const row = node.y;

    const neighbors = [];

    if (col + 1 < graph[row].length && graph[row][col + 1].value != 0) {
        neighbors.push(graph[row][col + 1]);
    }
    if (col - 1 >= 0 && graph[row][col - 1].value != 0) {
        neighbors.push(graph[row][col - 1]);
    }

    if (row + 1 < graph.length) {
        if (graph[row + 1][col].value != 0) {
            neighbors.push(graph[row + 1][col]);
        }
        if (col - 1 >= 0 && graph[row + 1][col - 1].value != 0) {
            if (graph[row][col - 1].value != 0 || graph[row + 1][col].value != 0) {
                neighbors.push(graph[row + 1][col - 1]); //
            }
        }
        if (col + 1 < graph[row + 1].length && graph[row + 1][col + 1].value != 0) {
            if (graph[row + 1][col].value != 0 || graph[row][col + 1].value != 0) {
                neighbors.push(graph[row + 1][col + 1]); //
            }
        }
    }

    if (row - 1 >= 0) {
        if (graph[row - 1][col].value != 0) {
            neighbors.push(graph[row - 1][col]);
        }
        if (col - 1 >= 0 && graph[row - 1][col - 1].value != 0) {
            if (graph[row][col - 1].value != 0 || graph[row - 1][col].value != 0) {
                neighbors.push(graph[row - 1][col - 1]); //
            }
        }
        if (col + 1 < graph[row - 1].length && graph[row - 1][col + 1].value != 0) {
            if (graph[row][col + 1].value != 0 || graph[row - 1][col].value != 0) {
                neighbors.push(graph[row - 1][col + 1]); //
            }
        }
    }
    return neighbors;
}



function get_8_neighbors_C(graph, node) {
    const col = node.x;
    const row = node.y;

    const neighbors = [];

    if (col + 1 < graph[row].length && graph[row][col + 1].value != 0) {
        neighbors.push(graph[row][col + 1]);
    }
    if (col - 1 >= 0 && graph[row][col - 1].value != 0) {
        neighbors.push(graph[row][col - 1]);
    }

    if (row + 1 < graph.length) {
        if (graph[row + 1][col].value != 0) {
            neighbors.push(graph[row + 1][col]);
        }
        if (col - 1 >= 0 && graph[row + 1][col - 1].value != 0) {
            if (graph[row][col - 1].value != 0 && graph[row + 1][col].value != 0) {
                neighbors.push(graph[row + 1][col - 1]); //
            }
        }
        if (col + 1 < graph[row + 1].length && graph[row + 1][col + 1].value != 0) {
            if (graph[row + 1][col].value != 0 && graph[row][col + 1].value != 0) {
                neighbors.push(graph[row + 1][col + 1]); //
            }
        }
    }

    if (row - 1 >= 0) {
        if (graph[row - 1][col].value != 0) {
            neighbors.push(graph[row - 1][col]);
        }
        if (col - 1 >= 0 && graph[row - 1][col - 1].value != 0) {
            if (graph[row][col - 1].value != 0 && graph[row - 1][col].value != 0) {
                neighbors.push(graph[row - 1][col - 1]); //
            }
        }
        if (col + 1 < graph[row - 1].length && graph[row - 1][col + 1].value != 0) {
            if (graph[row][col + 1].value != 0 && graph[row - 1][col].value != 0) {
                neighbors.push(graph[row - 1][col + 1]); //
            }
        }
    }
    return neighbors;
}



function a_star(map, start, goal, h, get_neighbors) {
    openSet = new Set(); // TODO : should be priority queue for better performances
    openSet.add(start);

    cameFrom = new Map();

    gScore = new CustomMap(); // map where default value should be infinity
    gScore.set(start, 0);

    fScore = new CustomMap(); // map where default value should be infinity
    fScore.set(start, h(start, goal));


    while (openSet.size > 0) {


        let current = openSet.values().next().value;
        for (const node of openSet) {
            if (fScore.get(node) < fScore.get(current)) {
                current = node;
            }
        }

        if (current == goal) {
            return reconstruct_path(cameFrom, current);
        }

        openSet.delete(current);
        for (const neighbor of get_neighbors(map, current)) {
            const tentative_gScore = gScore.get(current) + current.distance_to(neighbor)
            if (tentative_gScore < gScore.get(neighbor)) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentative_gScore);
                fScore.set(neighbor, tentative_gScore + h(neighbor, goal));
                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                }
            }
        }


    }

    return [];

}
