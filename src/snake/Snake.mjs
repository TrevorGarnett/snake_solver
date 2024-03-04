import Apple from './Apple.mjs';
import { directions, arrayCompare } from './Directions.mjs';

const EMPTY = 0;
const HEAD = 1;
const BODY = 2;
const TAIL = 3;
const APPLE = 4;
export default class Snake {
    constructor(width, height, canvas) {
        // Head is last element of list
        this.frequency = 200;
        this.canvas = canvas;
        this.w = width;
        this.h = height
        this.squareSize = Math.floor(Math.min(this.canvas.width / this.w, this.canvas.height / this.h));
        this.body = [[this.w / 2 - 1, this.h / 2], [this.w / 2, this.h / 2]];
        this.started = false;
        this.officialDir = [0, 0];
        this.render();
        this.start = undefined;
        this.current = undefined;
        this.apple = new Apple(this.w, this.h, this.canvas, this.body);
        this.apple.spawn(this.body);
        this.move = 0; // Index of the first move to be executed in the moves array
        this.numMoves = 0; // Number of moves in the moves array
        this.moves = new Array(5);
        this.initalizeState();
        window.requestAnimationFrame(this.step);
    }


    // Function to get the game state, as a 2D array
    initalizeState() {

        // Initialize the state array with zeros
        this.state = Array.from({ length: this.h }, () => Array.from({ length: this.w }, () => EMPTY));

        // Set '1' for snake head
        let [headX, headY] = this.body[this.body.length - 1];
        this.state[headY][headX] = HEAD;

        // Set '2' for snake body segments
        for (let i = 1; i < this.body.length - 1; i++) {
            const [x, y] = this.body[i];
            this.state[y][x] = BODY;
        }

        // Set '3' for tail
        let [tailX, tailY] = this.body[0];
        this.state[tailY][tailX] = TAIL;

        // Set '4' for apple
        let [appleX, appleY] = this.apple.pos;
        this.state[appleY][appleX] = APPLE;
    }

    // Move the snake in the state based on the direction
    // Move tail to the position of the previous body segment
    // Move body segment to the previous head position if apple not eaten
    // Move head to the new position
    // Move apple if necessary
    updateState() {
        const [headX, headY] = this.body[this.body.length - 1]; // New head location
        const [prevX, prevY] = this.body[this.body.length - 2]; // Previous location of head at time step before
        const [newTailX, newTailY] = this.body[0]; // New tail location
        this.state[headY][headX] = HEAD; // Update head in 2D array
        this.state[prevY][prevX] = BODY; // Update previous head location to body
        this.state[newTailY][newTailX] = TAIL; // Update new tail location
        if (!this.appleEaten) {
            this.state[this.tail[1]][this.tail[0]] = 0; // Update tail to 0
        }
        else {
            const [appleX, appleY] = this.apple.pos;
            this.state[appleY][appleX] = APPLE; // Update apple location
            this.appleEaten = false;
        }
    }

    printState() {
        console.log("-----------------------------------------");
        for (let i = 0; i < this.state.length; i++) {
            let string = ''
            for (let j = 0; j < this.state[i].length; j++) {
                string += this.state[i][j].toString() + ' ';
            }
            console.log(string + '\n');
        }
    }

    step = (timeStep) => {
        if (this.started) {
            if (this.start === undefined) {
                this.start = timeStep;
                this.current = 0;
            }
            const elapsed = timeStep - this.start;
            if (Math.floor(elapsed / this.frequency) > this.current) {
                this.current = Math.floor(elapsed / this.frequency);
                if (this.numMoves >= 1) {
                    this.officialDir = this.moves[this.move];
                    this.move = (this.move + 1) % 5;
                    this.numMoves--;
                }
                this.body.push([this.body[this.body.length - 1][0] + this.officialDir[0], this.body[this.body.length - 1][1] + this.officialDir[1]]);
                this.appleEaten = arrayCompare(this.body[this.body.length - 1], this.apple.pos);
                if (this.appleEaten) {
                    this.apple.spawn(this.body);
                    // Define tail
                } else {
                    this.tail = this.body.shift();
                }
                this.lost = this.gameOver();
                if (!this.lost) {
                    this.updateState();
                }
            }
            if (!this.lost) {
                this.grow(elapsed);
                if (!this.appleEaten) {
                    this.shrink(elapsed);
                }
                window.requestAnimationFrame(this.step);
            } else {
                this.restartGame();
            }
        }
    }

    setDir(dir) {
        if (!this.started && arrayCompare(dir, directions["left"])) return;
        this.started = true;
        let lastMove = [0, 0];
        if (this.numMoves > 0) {
            lastMove = this.moves[(this.move + this.numMoves - 1) % 5];;
        } else {
            lastMove = this.officialDir;
        }
        if (this.numMoves < 5 && !arrayCompare([-lastMove[0], -lastMove[1]], dir) && !arrayCompare(lastMove, dir)) {
            let next = (this.move + this.numMoves) % 5;
            this.moves[next] = dir;
            this.numMoves++;
        }

    }

    /* 
        grow() is called once per small time step. 
        It grows the snake by a number of pixels to create smooth movement between tiles. 
        It also updates the official direction of the Snake,
    */
    grow(elapsed) {
        if (arrayCompare([0, 0], this.officialDir)) {
            return;
        }
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "#3BB143";
        let headX = this.body[this.body.length - 1][0] * this.squareSize;
        let headY = this.body[this.body.length - 1][1] * this.squareSize;
        ctx.clearRect(headX, headY, this.squareSize, this.squareSize);
        // Offset
        let e = .05 * this.squareSize;
        // Set size of rectangle
        let d = this.squareSize * (elapsed % this.frequency) / this.frequency;
        if (d / this.squareSize > .90) d = .95 * this.squareSize;
        // Set direction, and draw rectangle to be moving in the correct direction
        if (arrayCompare(this.officialDir, directions["down"])) {
            ctx.fillRect(headX + e, headY - e, this.squareSize - 2 * e, d + e);
            this.drawEyes("down", d, ctx, headX, headY);
        }
        else if (arrayCompare(this.officialDir, directions["up"])) {
            ctx.fillRect(headX + e, headY + this.squareSize - d, this.squareSize - 2 * e, d + e);
            this.drawEyes("up", d, ctx, headX, headY);
        }
        else if (arrayCompare(this.officialDir, directions["right"])) {
            ctx.fillRect(headX - e, headY + e, d + e, this.squareSize - 2 * e);
            this.drawEyes("right", d, ctx, headX, headY);
        }
        else if (arrayCompare(this.officialDir, directions["left"])) {
            ctx.fillRect(headX + this.squareSize - d, headY + e, d + e, this.squareSize - 2 * e);
            this.drawEyes("left", d, ctx, headX, headY);
        } else {
            console.log("Error");
        }
    }

    // Logic to shrink tail
    shrink(elapsed) {
        if (this.officialDir[0] === 0 && this.officialDir[1] === 0) {
            return;
        }
        let ctx = this.canvas.getContext("2d");
        let tailX = this.tail[0] * this.squareSize;
        let tailY = this.tail[1] * this.squareSize;
        let d = this.squareSize * (elapsed % this.frequency) / this.frequency;
        if (d / this.squareSize > .90) d = this.squareSize;
        let tailDir = this.getTailDir();
        if (arrayCompare(tailDir, directions["down"])) {
            ctx.clearRect(tailX, tailY, this.squareSize, d);
        }
        else if (arrayCompare(tailDir, directions["up"])) {
            ctx.clearRect(tailX, tailY + this.squareSize - d, this.squareSize, d);
        }
        else if (arrayCompare(tailDir, directions["right"])) {
            ctx.clearRect(tailX, tailY, d, this.squareSize);

        }
        else if (arrayCompare(tailDir, directions["left"])) {
            ctx.clearRect(tailX + this.squareSize - d, tailY, d, this.squareSize);

        } else {
            console.log("Error");
        }
    }

    // getTailDir() function called by shrink() to determine the movement direction of the tail
    getTailDir() {
        let next = this.body[0];
        return [next[0] - this.tail[0], next[1] - this.tail[1]];
    }

    // Determine if the Snake has died
    // Death is determined by going out of bounds or having the Snake's head run into its body
    gameOver() {
        // Get head of Snake
        let head = this.body[this.body.length - 1];
        // Get coordinates of head
        let x = head[0];
        let y = head[1];
        // Check if head is out of bounds
        if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
            return true;
        }
        if (arrayCompare(head, this.tail)) {
            return true;
        }
        // Check if head is in body
        for (let element of this.body.slice(0, this.body.length - 1)) {
            if (arrayCompare(element, head)) {
                return true;
            }
        }
        return false;
    }

    restartGame() {
        this.body = [[this.w / 2 - 1, this.h / 2], [this.w / 2, this.h / 2]];
        this.started = false;
        this.officialDir = [0, 0];
        this.start = undefined;
        this.current = undefined;

        this.moves = [];
        this.move = 0; // Index of the first move to be executed in the moves array
        this.numMoves = 0; // Number of moves in the moves array

        let ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.apple.spawn(this.body);
        this.render();
        this.lost = false;

        this.initalizeState();
    }

    // Render the Snake
    render() {
        let e = .05 * this.squareSize;
        let ctx = this.canvas.getContext("2d");
        let x = this.body[0][0] * this.squareSize;
        let y = this.body[0][1] * this.squareSize;

        ctx.fillStyle = "#3BB143";
        ctx.fillRect(x, y + e, 2 * this.squareSize, this.squareSize - 2 * e);

        // Render the Snake's eyes
        let eyeX = x + 1.7 * this.squareSize
        let eyeSize = 0.2 * this.squareSize;
        ctx.fillStyle = "White";

        // Snake's left eye
        ctx.fillRect(eyeX, y + 0.2 * this.squareSize, eyeSize, eyeSize);

        // Snake's right eye
        ctx.fillRect(eyeX, y + 0.6 * this.squareSize, eyeSize, eyeSize);

        // Render the Snake's pupils
        let pupilSize = 0.1 * this.squareSize;
        ctx.fillStyle = "Black";

        // Snake's left pupil
        let pupilX = eyeX + 0.1 * this.squareSize;
        ctx.fillRect(pupilX, y + 0.25 * this.squareSize, pupilSize, pupilSize);

        // Snake's right pupil
        ctx.fillRect(pupilX, y + 0.65 * this.squareSize, pupilSize, pupilSize);

    }

    drawEyes(dir, d, ctx, headX, headY) {
        // Snake moving to the right
        if (dir === "right") {
            // Render the Snake's eyes
            let eyeX = headX + 1.7 * this.squareSize;
            let eyeSize = 0.2 * this.squareSize;

            // Paint green before eyes
            ctx.fillStyle = "#3BB143";
            ctx.fillRect(headX + d - 0.9 * this.squareSize, headY + 0.1 * this.squareSize, 0.8 * this.squareSize, 0.8 * this.squareSize);

            // ctx.fillRect(headX + 0.1 * this.squareSize, headY + d - 0.9 * this.squareSize, 0.8 * this.squareSize, 0.8 * this.squareSize);


            ctx.fillStyle = "White";

            // Snake's left eye
            ctx.fillRect(eyeX + d - this.squareSize * 2, headY + 0.2 * this.squareSize, eyeSize, eyeSize);

            // Snake's right eye
            ctx.fillRect(eyeX + d - this.squareSize * 2, headY + 0.6 * this.squareSize, eyeSize, eyeSize);

            // Render the Snake's pupils
            let pupilSize = 0.1 * this.squareSize;
            ctx.fillStyle = "Black";

            // Snake's left pupil
            let pupilX = eyeX + 0.1 * this.squareSize + d;
            ctx.fillRect(pupilX - this.squareSize * 2, headY + 0.25 * this.squareSize, pupilSize, pupilSize);

            // Snake's right pupil
            ctx.fillRect(pupilX - this.squareSize * 2, headY + 0.65 * this.squareSize, pupilSize, pupilSize);
        }
        // Snake moving left
        else if (dir === "left") {

            // Render the Snake's eyes
            let eyeX = headX + 1.125 * this.squareSize;
            let eyeSize = 0.2 * this.squareSize;

            // Paint green before eyes
            ctx.fillStyle = "#3BB143";
            ctx.fillRect(eyeX - d, headY + 0.1 * this.squareSize, this.squareSize * 0.8, 0.8 * this.squareSize);

            ctx.fillStyle = "White";

            // Snake's left eye
            ctx.fillRect(eyeX - d, headY + 0.2 * this.squareSize, eyeSize, eyeSize);

            // Snake's right eye
            ctx.fillRect(eyeX - d, headY + 0.6 * this.squareSize, eyeSize, eyeSize);

            // Render the Snake's pupils
            let pupilSize = 0.1 * this.squareSize;
            ctx.fillStyle = "Black";

            // Snake's left pupil
            let pupilX = eyeX;
            ctx.fillRect(pupilX - d, headY + 0.25 * this.squareSize, pupilSize, pupilSize);

            // Snake's right pupil
            ctx.fillRect(pupilX - d, headY + 0.65 * this.squareSize, pupilSize, pupilSize);
        }

        // Snake moving down
        else if (dir === "down") {
            // Render the Snake's eyes
            let eyeY = headY + 0.7 * this.squareSize;
            let eyeSize = 0.2 * this.squareSize;

            // Paint green before eyes
            ctx.fillStyle = "#3BB143";
            ctx.fillRect(headX + 0.1 * this.squareSize, headY + d - 0.9 * this.squareSize, 0.8 * this.squareSize, 0.8 * this.squareSize);

            ctx.fillStyle = "White";

            // Snake's left eye
            ctx.fillRect(headX + 0.2 * this.squareSize, eyeY + d - this.squareSize, eyeSize, eyeSize);

            // Snake's right eye
            ctx.fillRect(headX + 0.6 * this.squareSize, eyeY + d - this.squareSize, eyeSize, eyeSize);

            // Render the Snake's pupils
            let pupilSize = 0.1 * this.squareSize;
            ctx.fillStyle = "Black";

            // Snake's left pupil
            let pupilY = eyeY + 0.1 * this.squareSize;
            ctx.fillRect(headX + 0.25 * this.squareSize, pupilY + d - this.squareSize, pupilSize, pupilSize);

            // Snake's right pupil
            ctx.fillRect(headX + 0.65 * this.squareSize, pupilY + d - this.squareSize, pupilSize, pupilSize);
        }
        // Snake moving up
        else if (dir === "up") {
            // Render the Snake's eyes
            let eyeY = headY + 1.125 * this.squareSize;
            let eyeSize = 0.2 * this.squareSize;

            // Paint green before eyes
            ctx.fillStyle = "#3BB143";
            ctx.fillRect(headX + 0.1 * this.squareSize, eyeY - d, 0.8 * this.squareSize, 0.8 * this.squareSize);
            ctx.fillStyle = "White";

            // Snake's left eye
            ctx.fillRect(headX + 0.2 * this.squareSize, eyeY - d, eyeSize, eyeSize);

            // Snake's right eye
            ctx.fillRect(headX + 0.6 * this.squareSize, eyeY - d, eyeSize, eyeSize);

            // Render the Snake's pupils
            let pupilSize = 0.1 * this.squareSize;
            ctx.fillStyle = "Black";

            // Snake's left pupil
            let pupilY = eyeY;
            ctx.fillRect(headX + 0.25 * this.squareSize, pupilY - d, pupilSize, pupilSize);

            // Snake's right pupil
            ctx.fillRect(headX + 0.65 * this.squareSize, pupilY - d, pupilSize, pupilSize);
        }
    }
}
