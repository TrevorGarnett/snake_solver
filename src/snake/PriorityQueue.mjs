export default class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(square, dist) {
        this.queue.push({ item: square, priority: dist });
        let current = this.queue.length - 1;
        let parent = (current - 1) >> 1;
        // Min heapify
        while (current > 0 && this.queue[parent].priority > dist) {
            let temp = this.queue[parent];
            this.queue[parent] = this.queue[current];
            this.queue[current] = temp;
            current = parent;
            parent = (current - 1) >> 1;
        }
    }

    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        let smallestElement = this.queue[0];
        this.queue[0] = this.queue[this.queue.length - 1];
        this.queue.pop();
        let i = 0;
        let lChild = 2 * i + 1;
        let rChild = 2 * i + 2;
        while (lChild < this.queue.length) {
            let min = (this.queue[lChild].priority < this.queue[i].priority) ? lChild : i;
            if (rChild < this.queue.length) {
                min = (this.queue[rChild].priority < this.queue[min].priority) ? rChild : min;
            }
            if (min === i) {
                break;
            } else if (min === lChild) {
                let temp = this.queue[i];
                this.queue[i] = this.queue[lChild];
                this.queue[lChild] = temp;
                i = lChild;
            } else if (min === rChild) {
                let temp = this.queue[i];
                this.queue[i] = this.queue[rChild];
                this.queue[rChild] = temp;
                i = rChild;
            }
            lChild = 2 * i + 1;
            rChild = 2 * i + 2;
        }
        return [smallestElement.item, smallestElement.priority];
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}