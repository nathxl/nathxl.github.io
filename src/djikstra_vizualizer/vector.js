class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y)
    }

    substract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y)
    }

    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar)
    }

    divide(scalar) {
        if (scalar == 0) return new Vector(0, 0);
        return new Vector(this.x / scalar, this.y / scalar);
    }

    distanceTo(vector) {
        return vector.substract(this).magnitude();
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    unit() {
        const magnitude = this.magnitude();
        return new Vector(this.x / magnitude, this.y / magnitude);
    }

    normal() {
        return new Vector(this.y, -this.x);
    }

    dotProduct(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    angle(vector) {
        return Math.acos(this.dotProduct(vector) / (this.magnitude() * vector.magnitude()));
    }
}