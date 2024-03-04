import { AStar } from './Pathfind.mjs';
import { useEffect } from 'react';
import Snake from "./Snake.mjs";
import Board from "./Board.mjs";

// Delete the below after our test
const A = [
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
];
const start = [0, 0];
const end = [9, 9];

const SnakeGame = () => {
    useEffect(() => {
        return () => {
            console.log("Reading main successfully");
            console.log(AStar(A, start, end));
            // Get canvas
            let canvas1 = document.getElementById("canvas1");
            let canvas2 = document.getElementById("canvas2");

            // Edit Size
            canvas1.width = window.innerWidth;
            canvas1.height = window.innerHeight;
            canvas2.width = window.innerWidth;
            canvas2.height = window.innerHeight;

            let board = new Board(10, 10, canvas1);
            board.draw();
            let snake = new Snake(10, 10, canvas2);
            window.addEventListener("keydown", (e) => {
                window.requestAnimationFrame(snake.step);
                if (e.key === "ArrowUp") {
                    snake.setDir([0, - 1]);
                } else if (e.key === "ArrowDown") {
                    snake.setDir([0, 1]);
                } else if (e.key === "ArrowLeft") {
                    snake.setDir([-1, 0]);
                } else if (e.key === "ArrowRight") {
                    snake.setDir([1, 0]);
                }
                else if (e.key.toLowerCase() === "w") {
                    snake.setDir([0, -1]);
                } else if (e.key.toLowerCase() === "s") {
                    snake.setDir([0, 1]);
                } else if (e.key.toLowerCase() === "a") {
                    snake.setDir([-1, 0]);
                } else if (e.key.toLowerCase() === "d") {
                    snake.setDir([1, 0]);
                }
            });
        }
    });

    return (
        <div id="wrapper">
            <canvas id="canvas1"></canvas>
            <canvas id="canvas2"></canvas>
            <script type="module" src="./snake/SnakeGame.mjs"></script>

        </div>
    );
};

export default SnakeGame;

// // Play Game

// // int main(int argc, char **argv[]) {
// //     return 0;
// // }