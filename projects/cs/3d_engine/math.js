function get_translation_matrix(tx, ty, tz) {
    return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [tx, ty, tz, 1]];
}

function get_rotation_x_matrix(a) {
    return [[1, 0, 0, 0], [0, Math.cos(a), Math.sin(a), 0], [0, -Math.sin(a), Math.cos(a), 0], [0, 0, 0, 1]];
}

function get_rotation_y_matrix(a) {
    return [[Math.cos(a), 0, -Math.sin(a), 0], [0, 1, 0, 0], [Math.sin(a), 0, Math.cos(a), 0], [0, 0, 0, 1]];
}

function get_rotation_z_matrix(a) {
    return [[Math.cos(a), Math.sin(a), 0, 0], [-Math.sin(a), Math.cos(a), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
}

function get_scaling_matrix(n) {
    return [[n, 0, 0, 0], [0, n, 0, 0], [0, 0, n, 0], [0, 0, 0, 1]];
}


function cos(angle) {
    return Math.cos(angle);
}

function sin(angle) {
    return Math.sin(angle);
}

function get_rotation_around_axis_matrix(ux, uy, uz, angle) {
    /* return [
        [ux * ux * (1 - cos(angle)) + cos(angle), ux * uy * (1 - cos(angle)) - uz * sin(angle), ux * uz * (1 - cos(angle)) + uy * sin(angle)],
        [ux * uy * (1 - cos(angle)) + uz * sin(angle), uy * uy * (1 - cos(angle)) + cos(angle), uy * uz * (1 - cos(angle)) - ux * sin(angle)],
        [ux * uz * (1 - cos(angle)) - uy * sin(angle), uy * uz * (1 - cos(angle)) + ux * sin(angle), uz * uz * (1 - cos(angle)) + cos(angle)],
        [0, 0, 0, 1]
    ]; */

    return [
        [ux * ux * (1 - cos(angle)) + cos(angle), ux * uy * (1 - cos(angle)) + uz * sin(angle), ux * uz * (1 - cos(angle)) - uy * sin(angle)],
        [ux * uy * (1 - cos(angle)) - uz * sin(angle), uy * uy * (1 - cos(angle)) + cos(angle), uy * uz * (1 - cos(angle)) + ux * sin(angle)],
        [ux * uz * (1 - cos(angle)) + uy * sin(angle), uy * uz * (1 - cos(angle)) - ux * sin(angle), uz * uz * (1 - cos(angle)) + cos(angle)],
        [0, 0, 0, 1]
    ];
}

function multiply_matrices(a, b) {
    let aNumRows = a.length;
    let aNumCols = a[0].length;
    let bNumRows = b.length;
    let bNumCols = b[0].length;
    let m = new Array(aNumRows);  // initialize array of rows
    for (let r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (let c = 0; c < bNumCols; ++c) {
            m[r][c] = 0;             // initialize the current cell
            for (var i = 0; i < aNumCols; ++i) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}

function divide_matrix_by_scalar(m, divider) {
    let out = [];
    for (let r = 0; r < m.length; r++) {
        out.push([]);
        for (let c = 0; c < m[0].length; c++) {
            out[r].push(m[r][c] / divider);
        }
    }
    return out;
}

function add_vectors(v1, v2) {
    v_out = [];
    for (let i = 0; i < v1.length; i++) {
        v_out.push(v1[i] + v2[i]);
    }
    return v_out;
}

function multiply_vector_by_scalar(vector, scalar) {
    v_out = [];
    for (let i = 0; i < vector.length; i++) {
        v_out.push(vector[i] * scalar);
    }
    return v_out;
}