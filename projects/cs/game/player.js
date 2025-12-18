class Player {
    radius = 20;
    position = new Vector2D(0, 0);
    speed = 1; // 2
    tasks = [];

    constructor(position) {
        this.position = position;
    }


    update(delta_time) {
        if (this.tasks.length == 0) return;
        const task = this.tasks[0];

        if (task.terminate) {
            this.tasks.shift();
            return;
        }

        if (!task.initialized) {
            task.init();
        }

        task.execute();
    }

    

    draw(context) {
        /* if (this.tasks.length != 0) {
            this.tasks[0].draw(context);
        } */

        for (const task of this.tasks) {
            task.draw(context);
        }

        context.strokeStyle = 'black';
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
    }
}