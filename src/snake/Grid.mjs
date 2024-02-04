import PriorityQueue from "./PriorityQueue.mjs";

/*
    Get's all the neighbors of a node, excluding nodes that have been
    visited, walls, and those that the snake ocupies.
*/
export class Grid {
    constructor(width, height, body) {
        // Dimensions of the grid
        this.width = width;
        this.height = height;
        this.body = body; // Body of the snake
        this.grid = new Array(height);
        for (let i = 0; i < height; i++) {
            this.grid[i] = new Array(width);
        }
    }

    set(pos, value) {
        grid[pos.y][pos.x] = value;
    }

    getNeighbors(pos, timeStep) {
        const { x, y } = pos;
        const neighbors = [[x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]];
        const validNeighbors = neighbors.filter(([x, y]) => {
            const bodyOfSnake = this.body.slice(timeStep);
            return x >= 0 && x < this.width && y >= 0 && y < this.height && !([x, y] in bodyOfSnake);
            // Might need to add change so that neighbor cannot be visited element.
        });
        return validNeighbors
    }

    Astar() {

    }
}