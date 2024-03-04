/*
    Get's all the neighbors of a node, excluding nodes that have been
    visited, walls, and those that the snake ocupies.
*/
export class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = new Array(height);
        for (let i = 0; i < height; i++) {
            this.grid[i] = new Array(width);
        }
    }

    set(pos, value) {
        this.grid[pos.y][pos.x] = value;
    }
}