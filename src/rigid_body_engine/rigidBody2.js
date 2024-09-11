class RigidBody2 {
    subParticles = [];
    selectedParticle = 0;

    m = 0;
    r = new Vector(0, 0, 0);
    v = new Vector(0, 0, 0);

    I = 0;
    theta = 0; // radians
    omega = 0; // angular velocity

    constructor(particles) {
        // Compute center of mass
        for (let i = 0; i < particles.length; i++) {
            this.r = this.r.add(particles[i].r.multiply(particles[i].m));
            this.m = this.m + particles[i].m;
            console.log(i);
        }
        this.r = this.r.divide(this.m);

        // make sub particles relative to the center of mass
        for (let i = 0; i < particles.length; i++) {
            this.subParticles.push(new SubParticle(particles[i].r.substract(this.r), particles[i].m));
        }

        // compute moment of inertia
        for (let i = 0; i < this.subParticles.length; i++) {
            this.I = this.I + this.subParticles[i].m * (this.subParticles[i].r.magnitude()) ** 2;
        }
    }

    reset() {
        this.r = new Vector(100, 100, 0);
        this.v = new Vector(0, 0, 0);
        this.theta = 0;
        this.omega = 0;
    }

    selectNextParticle() {
        this.selectedParticle++;
        if (this.selectedParticle >= this.subParticles.length) {
            this.selectedParticle = 0;
        }
    }

    drawVector(start, vector, color) {
        ctx.strokeStyle = color;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(start.x + vector.x, start.y + vector.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(start.x + vector.x, start.y + vector.y, 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

    drawTorque(center, torque, color) {
        ctx.strokeStyle = color;
        if (torque.z > 0) {
            ctx.beginPath();
            ctx.arc(center.x, center.y, 20, 0, Math.PI);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(center.x - 20, center.y, 2, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if (torque.z < 0) {
            ctx.beginPath();
            ctx.arc(center.x, center.y, 20, Math.PI, 2 * Math.PI);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(center.x - 20, center.y, 2, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    applyForce(ctx, location, force) {
        // the location is the vector, originating from the center of the rigid body, where the force will be applied
        this.drawVector(this.r, location, "blue");
        this.drawVector(this.r.add(location), force, "green");

        const acceleration = force.divide(this.m);
        this.v = this.v.add(acceleration.multiply(dt));

        const torque = location.crossProduct(force);
        this.applyTorque(torque);
    }

    applyTorque(torque) {
        this.drawTorque(this.r, torque, "red");
        const alpha = torque.z / this.I;
        this.omega = this.omega + alpha * dt;
    }

    applyVelocity(dt) {
        this.r = this.r.add(this.v.multiply(dt));
    }

    applyAngularVelocity(dt) {
        this.theta = this.theta + this.omega * dt;
    }

    draw() {
        ctx.fillStyle = '#B2C4E9';
        ctx.strokeStyle = 'black';

        // translate + rotate context
        ctx.save();
        ctx.translate(this.r.x, this.r.y);
        ctx.rotate(this.theta);

        // Draw polygon
        ctx.beginPath();
        ctx.moveTo(this.subParticles[0].r.x, this.subParticles[0].r.y);
        for (let i = 1; i < this.subParticles.length; i++) {
            ctx.lineTo(this.subParticles[i].r.x, this.subParticles[i].r.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw center of mass
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw selected particle
        /* ctx.beginPath();
        ctx.arc(this.subParticles[this.selectedParticle].r.x, this.subParticles[this.selectedParticle].r.y, 5, 0, 2 * Math.PI);
        ctx.stroke(); */

        // restore context
        ctx.restore();
    }

}