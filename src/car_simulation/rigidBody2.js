class RigidBody2 {


    subParticles = [];
    selectedParticle = 0;

    m = 0;
    r = new Vector(0, 0, 0);
    v = new Vector(0, 10, 0);

    I = 0;
    theta = 0; // radians
    omega = 0; // angular velocity

    wheel_angle = 0;
    wheels = [
        new Wheel(new Vector(-25, -35, 0), 0.5),
        new Wheel(new Vector(+25, -35, 0), 0.5),
        new Wheel(new Vector(+25, +35, 0), 0),
        new Wheel(new Vector(-25, +35, 0), 0)
    ];

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

    turn_wheels(angle) {
        this.wheels[0].angle += angle;
        this.wheels[1].angle += angle;
    }

    move_forward(context) {
        const force_left_wheel = Vector.vector_from_angle(this.theta + this.wheels[0].angle).normal().multiply(50);
        const force_right_wheel = Vector.vector_from_angle(this.theta + this.wheels[1].angle).normal().multiply(50);
        this.applyForce(context, this.wheels[0].position.rotateAroundZ(this.theta), force_left_wheel);
        this.applyForce(context, this.wheels[1].position.rotateAroundZ(this.theta), force_right_wheel);
    }

    move_backward(context) {
        const force_left_wheel = Vector.vector_from_angle(this.theta + this.wheels[0].angle).normal().multiply(-50);
        const force_right_wheel = Vector.vector_from_angle(this.theta + this.wheels[1].angle).normal().multiply(-50);
        this.applyForce(context, this.wheels[0].position.rotateAroundZ(this.theta), force_left_wheel);
        this.applyForce(context, this.wheels[1].position.rotateAroundZ(this.theta), force_right_wheel);
    }

    apply_friction(context) {
        // instant velocity = angular velocity + linear velocity
        const front_left_wheel_normal = Vector.vector_from_angle(this.theta + this.wheels[0].angle);
        const front_left_wheel_abs_pos = this.r.add(this.wheels[0].position.rotateAroundZ(this.theta));
        const front_left_wheel_instant_velocity = this.wheels[0].position.rotateAroundZ(this.theta).normal().multiply(-this.omega).add(this.v);
        const front_left_wheel_normal_velocity = front_left_wheel_instant_velocity.project_onto(front_left_wheel_normal);
        const front_left_wheel_tangent_velocity = front_left_wheel_instant_velocity.project_onto(front_left_wheel_normal.normal());


        const front_right_wheel_normal = Vector.vector_from_angle(this.theta + this.wheels[1].angle);
        const front_right_wheel_abs_pos = this.r.add(this.wheels[1].position.rotateAroundZ(this.theta));
        const front_right_wheel_instant_velocity = this.wheels[1].position.rotateAroundZ(this.theta).normal().multiply(-this.omega).add(this.v);
        const front_right_wheel_normal_velocity = front_right_wheel_instant_velocity.project_onto(front_right_wheel_normal);
        const front_right_wheel_tangent_velocity = front_right_wheel_instant_velocity.project_onto(front_right_wheel_normal.normal());

        const back_left_wheel_normal = Vector.vector_from_angle(this.theta + this.wheels[3].angle);
        const back_left_wheel_abs_pos = this.r.add(this.wheels[3].position.rotateAroundZ(this.theta));
        const back_left_wheel_instant_velocity = this.wheels[3].position.rotateAroundZ(this.theta).normal().multiply(-this.omega).add(this.v);
        const back_left_wheel_normal_velocity = back_left_wheel_instant_velocity.project_onto(back_left_wheel_normal);
        const back_left_wheel_tangent_velocity = back_left_wheel_instant_velocity.project_onto(back_left_wheel_normal.normal());


        const back_right_wheel_normal = Vector.vector_from_angle(this.theta + this.wheels[2].angle);
        const back_right_wheel_abs_pos = this.r.add(this.wheels[2].position.rotateAroundZ(this.theta));
        const back_right_wheel_instant_velocity = this.wheels[2].position.rotateAroundZ(this.theta).normal().multiply(-this.omega).add(this.v);
        const back_right_wheel_normal_velocity = back_right_wheel_instant_velocity.project_onto(back_right_wheel_normal);
        const back_right_wheel_tangent_velocity = back_right_wheel_instant_velocity.project_onto(back_right_wheel_normal.normal());

        // left wheel normal
        // draw_vector(context, front_left_wheel_abs_pos, front_left_wheel_normal.multiply(50), 'orange');


        // Draw normal friction velocities
        draw_vector(context, front_left_wheel_abs_pos, front_left_wheel_normal_velocity, 'red');
        draw_vector(context, front_right_wheel_abs_pos, front_right_wheel_normal_velocity, 'red');
        draw_vector(context, back_left_wheel_abs_pos, back_left_wheel_normal_velocity, 'red');
        draw_vector(context, back_right_wheel_abs_pos, back_right_wheel_normal_velocity, 'red');

        // Draw tangent friction velocities
        draw_vector(context, front_left_wheel_abs_pos, front_left_wheel_tangent_velocity, 'blue');
        draw_vector(context, front_right_wheel_abs_pos, front_right_wheel_tangent_velocity, 'blue');
        draw_vector(context, back_left_wheel_abs_pos, back_left_wheel_tangent_velocity, 'blue');
        draw_vector(context, back_right_wheel_abs_pos, back_right_wheel_tangent_velocity, 'blue');

        // left wheel linear velocity
        draw_vector(context, front_left_wheel_abs_pos, front_left_wheel_instant_velocity, 'purple');
        draw_vector(context, front_right_wheel_abs_pos, front_right_wheel_instant_velocity, 'purple');
        draw_vector(context, back_left_wheel_abs_pos, back_left_wheel_instant_velocity, 'purple');
        draw_vector(context, back_right_wheel_abs_pos, back_right_wheel_instant_velocity, 'purple');


        const normal_mu = 1; // mu : friction coeffiecent
        const tangent_mu = 0.1;

        const normal_force_magnitude = this.m * 10;

        const front_left_wheel_normal_friction_force = front_left_wheel_normal_velocity.unit().multiply(-1 * normal_mu * normal_force_magnitude);
        const front_right_wheel_normal_friction_force = front_right_wheel_normal_velocity.unit().multiply(-1 * normal_mu * normal_force_magnitude);
        const back_left_wheel_normal_friction_force = back_left_wheel_normal_velocity.unit().multiply(-1 * normal_mu * normal_force_magnitude);
        const back_right_wheel_normal_friction_force = back_right_wheel_normal_velocity.unit().multiply(-1 * normal_mu * normal_force_magnitude);

        // Draw normal friction forces 
        draw_vector(context, front_left_wheel_abs_pos, front_left_wheel_normal_friction_force, 'orange');
        draw_vector(context, front_right_wheel_abs_pos, front_right_wheel_normal_friction_force, 'orange');
        draw_vector(context, back_left_wheel_abs_pos, back_left_wheel_normal_friction_force, 'orange');
        draw_vector(context, back_right_wheel_abs_pos, back_right_wheel_normal_friction_force, 'orange');


        const front_left_wheel_tangent_friction_force = front_left_wheel_tangent_velocity.unit().multiply(-1 * tangent_mu * normal_force_magnitude);
        const front_right_wheel_tangent_friction_force = front_right_wheel_tangent_velocity.unit().multiply(-1 * tangent_mu * normal_force_magnitude);
        const back_left_wheel_tangent_friction_force = back_left_wheel_tangent_velocity.unit().multiply(-1 * tangent_mu * normal_force_magnitude);
        const back_right_wheel_tangent_friction_force = back_right_wheel_tangent_velocity.unit().multiply(-1 * tangent_mu * normal_force_magnitude);

        // Draw normal friction forces 
        draw_vector(context, front_left_wheel_abs_pos, front_left_wheel_tangent_friction_force.multiply(20), 'orange');
        draw_vector(context, front_right_wheel_abs_pos, front_right_wheel_tangent_friction_force.multiply(20), 'orange');
        draw_vector(context, back_left_wheel_abs_pos, back_left_wheel_tangent_friction_force.multiply(20), 'orange');
        draw_vector(context, back_right_wheel_abs_pos, back_right_wheel_tangent_friction_force.multiply(20), 'orange');


        this.applyForce(context, this.wheels[0].position.rotateAroundZ(this.theta), front_left_wheel_normal_friction_force);
        this.applyForce(context, this.wheels[1].position.rotateAroundZ(this.theta), front_right_wheel_normal_friction_force);
        this.applyForce(context, this.wheels[3].position.rotateAroundZ(this.theta), back_left_wheel_normal_friction_force);
        this.applyForce(context, this.wheels[2].position.rotateAroundZ(this.theta), back_right_wheel_normal_friction_force);

        this.applyForce(context, this.wheels[0].position.rotateAroundZ(this.theta), front_left_wheel_tangent_friction_force);
        this.applyForce(context, this.wheels[1].position.rotateAroundZ(this.theta), front_right_wheel_tangent_friction_force);
        this.applyForce(context, this.wheels[3].position.rotateAroundZ(this.theta), back_left_wheel_tangent_friction_force);
        this.applyForce(context, this.wheels[2].position.rotateAroundZ(this.theta), back_right_wheel_tangent_friction_force);

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
        for (const sub_particle of this.subParticles) {
            ctx.lineTo(sub_particle.r.x, sub_particle.r.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        for (const wheel of this.wheels) {
            wheel.draw(ctx);
        }

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