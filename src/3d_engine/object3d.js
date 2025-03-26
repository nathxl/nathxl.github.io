class Object3d {

    // vertexes = [[[0, 0, 0, 1]], [[0, 1, 0, 1]], [[1, 1, 0, 1]], [[1, 0, 0, 1]], [[0, 0, 1, 1]], [[0, 1, 1, 1]], [[1, 1, 1, 1]], [[1, 0, 1, 1]]];
    // faces = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 4, 5, 1], [2, 3, 7, 6], [1, 2, 6, 5], [0, 3, 7, 4]];

    constructor(vertexes, faces) {
        this.vertexes = vertexes;
        this.faces = faces;
    }

    draw(camera) {
        this.screen_projection(camera);
    }

    screen_projection(camera) {
        let projected_vertexes = [];

        for (let i = 0; i < this.vertexes.length; i++) {
            const temp1 = multiply_matrices(this.vertexes[i], camera.camera_matrix());
            const temp2 = multiply_matrices(temp1, camera.projection_matrix());
            const temp3 = divide_matrix_by_scalar(temp2, temp2[0][3]);
            // TODO if x,y,z outside of [-1, 1] -> set it to 0 (7:54)
            const temp4 = multiply_matrices(temp3, camera.screen_matrix());
            projected_vertexes.push(temp4);
        }

        // draw faces
        ctx.strokeStyle = 'orange';
        for (let face_index = 0; face_index < this.faces.length; face_index++) {
            ctx.beginPath();
            for (let vertex_index = 0; vertex_index < this.faces[face_index].length; vertex_index++) {
                const projected_vertex = projected_vertexes[this.faces[face_index][vertex_index]];
                ctx.lineTo(projected_vertex[0][0], projected_vertex[0][1]);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // draw vertices
        ctx.strokeStyle = 'black';
        for (let vertex_index = 0; vertex_index < projected_vertexes.length; vertex_index++) {
            const projected_vertex = projected_vertexes[vertex_index];
            ctx.beginPath();
            ctx.arc(projected_vertex[0][0], projected_vertex[0][1], 3, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    translate(tx, ty, tz) {
        for (let i = 0; i < this.vertexes.length; i++) {
            this.vertexes[i] = multiply_matrices(this.vertexes[i], get_translation_matrix(tx, ty, tz));
        }
    }

    scale(scale_to) {
        for (let i = 0; i < this.vertexes.length; i++) {
            this.vertexes[i] = multiply_matrices(this.vertexes[i], get_scaling_matrix(scale_to));
        }
    }

    rotate_x(angle) {
        for (let i = 0; i < this.vertexes.length; i++) {
            this.vertexes[i] = multiply_matrices(this.vertexes[i], get_rotation_x_matrix(angle));
        }
    }

    rotate_y(angle) {
        for (let i = 0; i < this.vertexes.length; i++) {
            this.vertexes[i] = multiply_matrices(this.vertexes[i], get_rotation_y_matrix(angle));
        }
    }

    rotate_z(angle) {
        for (let i = 0; i < this.vertexes.length; i++) {
            this.vertexes[i] = multiply_matrices(this.vertexes[i], get_rotation_z_matrix(angle));
        }
    }
}