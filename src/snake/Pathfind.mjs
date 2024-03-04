import PriorityQueue from './PriorityQueue.mjs';

let width;
let height;

// Manhattan Distance
function heuristic1(start, end) {
    return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
}

export function AStar(A, start, end) {
    // A* algorithm
    let parentOf = new Map(); // Keep track of the parent of each node
    width = A[0].length;
    height = A.length;
    let visited = new Set(); // Keep track of visited nodes to avoid cycles
    let horizon = new PriorityQueue(); // Create a priority queue for nodes to be visited
    horizon.enqueue({ x: start[1], y: start[0], from: { x: -1, y: -1 } }, 0);
    while (!horizon.isEmpty()) {
        let current, dist;
        do {
            [current, dist] = horizon.dequeue(); // Get the next square to visit
        } while (!horizon.isEmpty() && visited.has(getTileNum(current))); // Skip visited squares
        if (visited.has(getTileNum(current))) {
            console.error("Failed to find valid neighbor. A* failed.");
            console.log("Visited: " + [...visited]);

            break;
        }
        parentOf.set(getTileNum(current), getTileNum(current.from)); // Add to parent map
        if (current.x === end[1] && current.y === end[0]) {
            const path = reconstructPath(parentOf, start, end);
            return path;
        }
        let neighbors = getNeighbors([current.x, current.y]); // All squares neighboring chosen square
        neighbors = neighbors.filter(neighbor => (A[neighbor.y][neighbor.x] & 3) === 0); // Not in snake
        neighbors = neighbors.filter(neighbor => !visited.has(getTileNum(neighbor))); // Not in visited
        for (let neighbor of neighbors) {
            let priority = heuristic1(neighbor, { x: end[1], y: end[0] }) + dist + 1;
            console.log("Priority: " + priority);
            horizon.enqueue(neighbor, priority);    // Add to priority queue
        }
        console.log(current, current.priority);
        console.log("Visited: " + visited.size);
        visited.add(getTileNum(current)); // Add current square to visited squares
    }
    console.error("Explored entire accessable grid, but no path was found. A* failed.");
}


// Returns a path from start to end, where start is the start is the first element of the array
function reconstructPath(parentOf, start, end) {
    // Reconstruct the path from start to end
    let current = getTileNum({ x: end[1], y: end[0] });
    let startVal = getTileNum({ x: start[1], y: start[0] });
    let path = [];
    while (current !== startVal) {
        path.unshift(reconstructTilePosition(current));
        current = parentOf.get(current);
    }
    return path;
}

function getTileNum(tile) {
    // Get the number of the tile
    return tile.y * width + tile.x;
}

function reconstructTilePosition(tileNum) {
    // Reconstruct the tile position
    return { x: tileNum % width, y: Math.floor(tileNum / width) };
}

function getNeighbors(pos) {
    const [c, r] = pos;
    const neighbors =
        [{ x: c, y: r - 1, from: { x: c, y: r } },
        { x: c, y: r + 1, from: { x: c, y: r } },
        { x: c + 1, y: r, from: { x: c, y: r } },
        { x: c - 1, y: r, from: { x: c, y: r } }];
    return neighbors.filter((neighbor) => {
        let x = neighbor.x;
        let y = neighbor.y;
        return x >= 0 && x < width && y >= 0 && y < height;
    });
}