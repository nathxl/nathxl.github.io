class RigidBody2 {
    subParticles = [];
    selectedParticle = 0;

    m = 0;
    r = new Vector3D(0, 0, 0);
    v = new Vector3D(0, 0, 0);

    I = 0;
    theta = 0; // radians
    omega = 0; // angular velocity

    draw_vectors = true;

    constructor(particles) {
        // Compute center of mass
        for (const particle of particles) {
            this.r = this.r.add(particle.r.multiply(particle.m));
            this.m = this.m + particle.m;
        }
        this.r = this.r.divide(this.m);

        // make sub particles relative to the center of mass
        for (const particle of particles) {
            this.subParticles.push(new SubParticle(particle.r.substract(this.r), particle.m));
        }

        // compute moment of inertia
        for (const particle of this.subParticles) {
            this.I = this.I + particle.m * (particle.r.magnitude()) ** 2;
        }
    }

    reset() {
        this.r = new Vector3D(150, 105, 0);
        this.v = new Vector3D(0, 0, 0);
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
        if (this.draw_vectors) {
            this.drawVector(this.r, location, "blue");
            this.drawVector(this.r.add(location), force, "green");
        }

        const acceleration = force.divide(this.m);
        this.v = this.v.add(acceleration.multiply(dt));

        const torque = location.crossProduct(force);
        this.applyTorque(torque);
    }

    applyTorque(torque) {
        if (this.draw_vectors) {
            this.drawTorque(this.r, torque, "red");
        }
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
        for (const sub_particle of this.subParticles) {
            ctx.lineTo(sub_particle.r.x, sub_particle.r.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw center of mass
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.stroke();

        // restore context
        ctx.restore();
    }

}

class SubParticle {

    r = new Vector3D(0, 0, 0);
    m = 1;

    constructor(r, m) {
        this.r = r;
        this.m = m;
    }

}