class Camera {
    position = [0, 0, 0, 1];
    forward = [0, 0, 1, 1];
    up = [0, 1, 0, 1];
    right = [1, 0, 0, 1];
    h_fov = Math.PI / 3;
    v_fov = this.h_fov * (canvas.height / canvas.width);
    near_plane = 0.1;
    far_plane = 100;

    translation_speed = 0.05;
    rotation_speed = 0.01;

    constructor(x, y, z) {
        this.position = [x, y, z, 1];
    }

    moveUp() {
        this.position = add_vectors(this.position, multiply_vector_by_scalar(this.up, + this.translation_speed));
    }

    moveDown() {
        this.position = add_vectors(this.position, multiply_vector_by_scalar(this.up, - this.translation_speed));
    }

    moveLeft() {
        this.position = add_vectors(this.position, multiply_vector_by_scalar(this.right, - this.translation_speed));
    }

    moveRight() {
        this.position = add_vectors(this.position, multiply_vector_by_scalar(this.right, + this.translation_speed));
    }

    moveForward() {
        this.position = add_vectors(this.position, multiply_vector_by_scalar(this.forward, + this.translation_speed));
    }

    moveBackward() {
        this.position = add_vectors(this.position, multiply_vector_by_scalar(this.forward, - this.translation_speed));
    }

    myPitch(angle) {
        const [x, y, z, w] = this.right;
        const rotation_around_axis_matrix = get_rotation_around_axis_matrix(x, y, z, angle);
        this.forward = multiply_matrices([this.forward], rotation_around_axis_matrix)[0];
        this.right = multiply_matrices([this.right], rotation_around_axis_matrix)[0];
        this.up = multiply_matrices([this.up], rotation_around_axis_matrix)[0];
    }

    myYaw(angle) {
        const [x, y, z, w] = this.up;
        const rotation_around_axis_matrix = get_rotation_around_axis_matrix(x, y, z, angle);
        this.forward = multiply_matrices([this.forward], rotation_around_axis_matrix)[0];
        this.right = multiply_matrices([this.right], rotation_around_axis_matrix)[0];
        this.up = multiply_matrices([this.up], rotation_around_axis_matrix)[0];
    }

    myRoll(angle) {
        const [x, y, z, w] = this.forward;
        const rotation_around_axis_matrix = get_rotation_around_axis_matrix(x, y, z, angle);
        this.forward = multiply_matrices([this.forward], rotation_around_axis_matrix)[0];
        this.right = multiply_matrices([this.right], rotation_around_axis_matrix)[0];
        this.up = multiply_matrices([this.up], rotation_around_axis_matrix)[0];
    }

    translate_matrix() {
        let [x, y, z, w] = this.position;
        return [[1, 0, 0, 0], [0, 1, 0, 1], [0, 0, 1, 0], [-x, -y, -z, 1]]; // remove last 1 in 2nd row ???
    }

    rotate_matrix() {
        let [rx, ry, rz, rw] = this.right;
        let [fx, fy, fz, fw] = this.forward;
        let [ux, uy, uz, uw] = this.up;
        return [[rx, ux, fx, 0], [ry, uy, fy, 0], [rz, uz, fz, 0], [0, 0, 0, 1]]
    }

    camera_matrix() {
        return multiply_matrices(this.translate_matrix(), this.rotate_matrix());
    }

    projection_matrix() {
        // make this hardcoded instead of function to reduce computations
        const NEAR = this.near_plane;
        const FAR = this.far_plane;
        const RIGHT = Math.tan(this.h_fov / 2);
        const LEFT = -RIGHT;
        const TOP = Math.tan(this.v_fov / 2);
        const BOTTOM = -TOP;

        const m00 = 2 / (RIGHT - LEFT);
        const m11 = 2 / (TOP - BOTTOM);
        const m22 = (FAR + NEAR) / (FAR - NEAR);
        const m32 = -2 * NEAR * FAR / (FAR - NEAR);

        return [[m00, 0, 0, 0], [0, m11, 0, 0], [0, 0, m22, 1], [0, 0, m32, 0]];
    }

    screen_matrix() {
        const HW = canvas.width / 2;
        const HH = canvas.height / 2;
        return [[HW, 0, 0, 0], [0, -HH, 0, 0], [0, 0, 1, 0], [HW, HH, 0, 1]];
    }
}