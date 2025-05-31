class Car extends RigidBody2 {
    power = 200;
    normal_mu = 10; // mu : friction coeffiecent
    tangent_mu = 1;

    wheel_angle = 0;
    draw_vectors = false;

    

    constructor() {
        const start_x = 85;
        const start_y = 75;

        const width = 25;
        const height = 50;

        const sp1 = new SubParticle(new Vector3D(start_x, start_y, 0), 1);
        const sp2 = new SubParticle(new Vector3D(start_x + width, start_y, 0), 1);
        const sp3 = new SubParticle(new Vector3D(start_x + width, start_y + height, 0), 1);
        const sp4 = new SubParticle(new Vector3D(start_x, start_y + height, 0), 1);

        super([sp1, sp2, sp3, sp4]);

        this.theta = Math.PI / 3;

        const wheel_offset_x = 10;
        const wheel_offset_y = 17;
        const wheel_w = 3;
        const wheel_l = 6;

        this.wheels = [
            new Wheel(new Vector3D(-wheel_offset_x, -wheel_offset_y, 0), 0.5, wheel_w, wheel_l),
            new Wheel(new Vector3D(+wheel_offset_x, -wheel_offset_y, 0), 0.5, wheel_w, wheel_l),
            new Wheel(new Vector3D(+wheel_offset_x, +wheel_offset_y, 0), 0, wheel_w, wheel_l),
            new Wheel(new Vector3D(-wheel_offset_x, +wheel_offset_y, 0), 0, wheel_w, wheel_l)
        ];


    }

    turn_wheels(direction) {
        this.wheels[0].turn(direction);
        this.wheels[1].turn(direction);
    }

    move_forward(context) {
        const force_left_wheel = Vector3D.vector_from_angle(this.theta + this.wheels[0].angle).normal().multiply(this.power);
        const force_right_wheel = Vector3D.vector_from_angle(this.theta + this.wheels[1].angle).normal().multiply(this.power);
        this.applyForce(context, this.wheels[0].position.rotateAroundZ(this.theta), force_left_wheel);
        this.applyForce(context, this.wheels[1].position.rotateAroundZ(this.theta), force_right_wheel);
    }

    move_backward(context) {
        const force_left_wheel = Vector3D.vector_from_angle(this.theta + this.wheels[0].angle).normal().multiply(-this.power);
        const force_right_wheel = Vector3D.vector_from_angle(this.theta + this.wheels[1].angle).normal().multiply(-this.power);
        this.applyForce(context, this.wheels[0].position.rotateAroundZ(this.theta), force_left_wheel);
        this.applyForce(context, this.wheels[1].position.rotateAroundZ(this.theta), force_right_wheel);
    }

    recenter_wheels() {
        this.wheels[0].recenter();
        this.wheels[1].recenter();
    }

    apply_friction(context) {
        // instant velocity = angular velocity + linear velocity
        const front_left_wheel_normal = Vector3D.vector_from_angle(this.theta + this.wheels[0].angle);
        const front_left_wheel_abs_pos = this.r.add(this.wheels[0].position.rotateAroundZ(this.theta));
        const front_left_wheel_instant_velocity = this.wheels[0].position.rotateAroundZ(this.theta).normal().multiply(-this.omega).add(this.v);
        const front_left_wheel_normal_velocity = front_left_wheel_instant_velocity.project_onto(front_left_wheel_normal);
        const front_left_wheel_tangent_velocity = front_left_wheel_instant_velocity.project_onto(front_left_wheel_normal.normal());


        const front_right_wheel_normal = Vector3D.vector_from_angle(this.theta + this.wheels[1].angle);
        const front_right_wheel_abs_pos = this.r.add(this.wheels[1].position.rotateAroundZ(this.theta));
        const front_right_wheel_instant_velocity = this.wheels[1].position.rotateAroundZ(this.theta).normal().multiply(-this.omega).add(this.v);
        const front_right_wheel_normal_velocity = front_right_wheel_instant_velocity.project_onto(front_right_wheel_normal);
        const front_right_wheel_tangent_velocity = front_right_wheel_instant_velocity.project_onto(front_right_wheel_normal.normal());

        const back_left_wheel_normal = Vector3D.vector_from_angle(this.theta + this.wheels[3].angle);
        const back_left_wheel_abs_pos = this.r.add(this.wheels[3].position.rotateAroundZ(this.theta));
        const back_left_wheel_instant_velocity = this.wheels[3].position.rotateAroundZ(this.theta).normal().multiply(-this.omega).add(this.v);
        const back_left_wheel_normal_velocity = back_left_wheel_instant_velocity.project_onto(back_left_wheel_normal);
        const back_left_wheel_tangent_velocity = back_left_wheel_instant_velocity.project_onto(back_left_wheel_normal.normal());


        const back_right_wheel_normal = Vector3D.vector_from_angle(this.theta + this.wheels[2].angle);
        const back_right_wheel_abs_pos = this.r.add(this.wheels[2].position.rotateAroundZ(this.theta));
        const back_right_wheel_instant_velocity = this.wheels[2].position.rotateAroundZ(this.theta).normal().multiply(-this.omega).add(this.v);
        const back_right_wheel_normal_velocity = back_right_wheel_instant_velocity.project_onto(back_right_wheel_normal);
        const back_right_wheel_tangent_velocity = back_right_wheel_instant_velocity.project_onto(back_right_wheel_normal.normal());



        // const normal_mu = 1; // mu : friction coeffiecent
        // const tangent_mu = 0.1;

        const normal_mu = this.normal_mu; // mu : friction coeffiecent
        const tangent_mu = this.tangent_mu;

        const normal_force_magnitude = this.m * 10;


        
        const front_left_wheel_normal_friction_force = front_left_wheel_normal_velocity.unit().multiply(-1 * normal_mu * normal_force_magnitude);
        const front_right_wheel_normal_friction_force = front_right_wheel_normal_velocity.unit().multiply(-1 * normal_mu * normal_force_magnitude);
        const back_left_wheel_normal_friction_force = back_left_wheel_normal_velocity.unit().multiply(-1 * normal_mu * normal_force_magnitude);
        const back_right_wheel_normal_friction_force = back_right_wheel_normal_velocity.unit().multiply(-1 * normal_mu * normal_force_magnitude);

        const front_left_wheel_tangent_friction_force = front_left_wheel_tangent_velocity.unit().multiply(-1 * tangent_mu * normal_force_magnitude);
        const front_right_wheel_tangent_friction_force = front_right_wheel_tangent_velocity.unit().multiply(-1 * tangent_mu * normal_force_magnitude);
        const back_left_wheel_tangent_friction_force = back_left_wheel_tangent_velocity.unit().multiply(-1 * tangent_mu * normal_force_magnitude);
        const back_right_wheel_tangent_friction_force = back_right_wheel_tangent_velocity.unit().multiply(-1 * tangent_mu * normal_force_magnitude);


        const cuttoff = 3;

        if (front_left_wheel_normal_velocity.magnitude() > cuttoff) {
            this.applyForce(context, this.wheels[0].position.rotateAroundZ(this.theta), front_left_wheel_normal_friction_force);
        }
        if (front_right_wheel_normal_velocity.magnitude() > cuttoff) {
            this.applyForce(context, this.wheels[1].position.rotateAroundZ(this.theta), front_right_wheel_normal_friction_force);
        }
        if (back_right_wheel_normal_velocity.magnitude() > cuttoff) {
            this.applyForce(context, this.wheels[2].position.rotateAroundZ(this.theta), back_right_wheel_normal_friction_force);
        }
        if (back_left_wheel_normal_velocity.magnitude() > cuttoff) {
            this.applyForce(context, this.wheels[3].position.rotateAroundZ(this.theta), back_left_wheel_normal_friction_force);
        }

        if (front_left_wheel_tangent_velocity.magnitude() > cuttoff) {
            this.applyForce(context, this.wheels[0].position.rotateAroundZ(this.theta), front_left_wheel_tangent_friction_force);
        }
        if (front_right_wheel_tangent_velocity.magnitude() > cuttoff) {
            this.applyForce(context, this.wheels[1].position.rotateAroundZ(this.theta), front_right_wheel_tangent_friction_force);
        }
        if (back_right_wheel_tangent_velocity.magnitude() > cuttoff) {
            this.applyForce(context, this.wheels[2].position.rotateAroundZ(this.theta), back_right_wheel_tangent_friction_force);
        }
        if (back_left_wheel_tangent_velocity.magnitude() > cuttoff) {
            this.applyForce(context, this.wheels[3].position.rotateAroundZ(this.theta), back_left_wheel_tangent_friction_force);
        }

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

        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1;


        for (const wheel of this.wheels) {
            wheel.draw(ctx);
        }

        // Draw center of mass
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.stroke();

        // restore context
        ctx.restore();
    }

}

