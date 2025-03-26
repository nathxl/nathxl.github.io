class Point {
    radius = 7;
    selected = false;

    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw(ctx) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    select(x, y) {
        const distance = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
        if (distance <= this.radius) {
            this.selected = true;
        }
    }

    unselect() {
        this.selected = false;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }
}

function intersection_between_4_points(p1, p2, p3, p4) {
    const denominator = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    const nominator_x = (p1.x * p2.y - p1.y * p2.x) * (p3.x - p4.x) - (p1.x - p2.x) * (p3.x * p4.y - p3.y * p4.x);
    const nominator_y = (p1.x * p2.y - p1.y * p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x * p4.y - p3.y * p4.x);
    const x = nominator_x / denominator;
    const y = nominator_y / denominator;
    return new Point(x, y, 'orange');
}


function two_points_to_line(p1, p2) {
    const a = (p2.y - p1.y) / (p2.x - p1.x);
    const b = p1.y - p1.x * a;
    return [a, b];
}

function intersection_line_circle(a, b, c, r) {
    const A = a**2 + 1;
    const B = 2 * (a*b - c.x - a*c.y);
    const C = c.x**2 + c.y**2 - 2*b*c.y + b**2 - r**2;

    const x1 = (-B + Math.sqrt(B**2 - 4*A*C)) / (2*A);
    const x2 = (-B - Math.sqrt(B**2 - 4*A*C)) / (2*A);

    const y1 = a * x1 + b;
    const y2 = a * x2 + b;

    return [new Point(x1, y1), new Point(x2, y2)];
}

function intersection_2_points_circle(p1, p2, c, r) {
    const [a, b] = two_points_to_line(p1, p2);
    return intersection_line_circle(a, b, c, r);
}