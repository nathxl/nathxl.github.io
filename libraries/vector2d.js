class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    multiply(constant) {
        return new Vector2D(this.x * constant, this.y * constant);
    }

    divide(constant) {
        if (constant == 0) return new Vector2D(0, 0);
        return new Vector2D(this.x / constant, this.y / constant);
    }

    add(vector) {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    distance_to(vector) {
        return vector.substract(this).magnitude();
    }

    substract(vector) {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    unit() {
        return new Vector2D(this.x, this.y).divide(this.magnitude());
    }

    normal() {
        return new Vector2D(this.y, -this.x);
    }

    angle_with(vector) {
        let angle = Math.acos(this.dot_product(vector) / (this.magnitude() * vector.magnitude()));
        if (this.y < 0) angle = 2 * Math.PI - angle;
        return angle;
    }

    dot_product(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

}