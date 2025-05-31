class PID {
    prev_error = 0;
    integral = 0;
    K_p = 1;
    K_i = 1;
    K_d = 1;
    log = false;

    compute(setpoint, point, dt) {
        const error = setpoint - point;
        const p_out = this.K_p * error;
        // this.integral = this.integral + error * dt;
        const sigmoid = ((1 / (1 + Math.E ** (- 0.1 * error))) - 0.5) * 20;
        this.integral = this.integral + sigmoid * dt; // sigmoid instead of linear because the integral term is for fine tuning not gross tuning, gross tuning is left to derivative and proportional terms
        if (this.log) {
            console.log(sigmoid);
        }
        const i_out = this.K_i * this.integral;
        const derivative = (error - this.prev_error) / dt;
        const d_out = this.K_d * derivative;
        const out = p_out + i_out + d_out;
        this.prev_error = error;
        return out;
    }
}