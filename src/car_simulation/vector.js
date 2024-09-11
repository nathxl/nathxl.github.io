class Vector {
    x = 0;
    y = 0;
    z = 0;

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    substract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    multiply(constant) {
        return new Vector(this.x * constant, this.y * constant, this.z * constant);
    }

    divide(constant) {
        if (constant == 0) return new Vector(0, 0, 0);
        return new Vector(this.x / constant, this.y / constant, this.z / constant);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    unit() {
        const magnitude = this.magnitude();
        return new Vector(this.x, this.y, this.z).divide(magnitude);
    }

    normal() {
        return new Vector(this.y, -this.x, 0);
    }

    rotateAroundZ(theta) {
        return new Vector(this.x * Math.cos(theta) - this.y * Math.sin(theta), this.x * Math.sin(theta) + this.y * Math.cos(theta), this.z);
    }

    dot_product(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    project_onto(vector) {
        // b : vector
        // a : this
        
        return vector.multiply(this.dot_product(vector) / (vector.magnitude() ** 2));
    }

    crossProduct(vector) {
        const x = this.y * vector.z - this.z * vector.y;
        const y = this.z * vector.x - this.x * vector.z;
        const z = this.x * vector.y - this.y * vector.x;
        return new Vector(x, y, z);
    }

    static vector_from_angle(angle) {
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        return new Vector(x, y, 0);
    }

}