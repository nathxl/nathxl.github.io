class Vector {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    multiply(constant) {
        return new Vector(this.x * constant, this.y * constant);
    }

    divide(constant) {
        if (constant == 0) return new Vector(0, 0);
        return new Vector(this.x / constant, this.y / constant);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    unit() {
        const magnitude = this.magnitude();
        return new Vector(this.x, this.y).divide(magnitude);
    }

    test() {
        console.log('vector test');
    }
}