import { arrayCompare } from "./Directions.mjs";
import image from "./apple.png";

export default class Apple {
    constructor(width, height, canvas, body) {
        this.canvas = canvas;
        this.maxX = width;
        this.maxY = height;
        this.squareSize = Math.floor(Math.min(this.canvas.width / this.maxX, this.canvas.height / this.maxY));
        this.spawn(body);
    }

    get pos() { return [this.x, this.y]; };

    spawn(body) {
        do {
            this.x = Math.floor(Math.random() * this.maxX);
            this.y = Math.floor(Math.random() * this.maxY);
        } while (this.inBody(body));
        this.render();
    }

    inBody(body) {
        for (const element of body) {
            if (arrayCompare(element, this.pos)) {
                return true;
            }
        }
        return false;
    }

    render() {
        const img = new Image();
        img.onerror = () => {
            console.error("Error loading image :(");
        };
        img.onload = () => {
            let ctx = this.canvas.getContext("2d");
            ctx.drawImage(img, this.x * this.squareSize, this.y * this.squareSize, this.squareSize, this.squareSize);
        };
        img.src = image;
    }

}