const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


const TILE_SIZE = 30


const delay = (delay_ms) => {
    return new Promise(resolve => setTimeout(resolve, delay_ms));
};


async function draw_circ(col, row, color) {
    const x = canvas.width / 2 + col * TILE_SIZE;
    const y = canvas.height / 2 + row * TILE_SIZE;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, TILE_SIZE / 3, 0, 2 * Math.PI);
    ctx.stroke();
    await delay(1000);
}




async function find() {
    for (let abs_layer = 1; abs_layer <= 3; abs_layer++) {
        for (let abs_offset = 0; abs_offset <= abs_layer; abs_offset++) {
            for (const offset of new Set([abs_offset * -1, abs_offset])) {
                for (const layer of new Set([abs_layer * -1, abs_layer])) {
                    await draw_circ(layer, offset, 'black');
                    if (offset != layer && offset != layer * -1) {
                        await draw_circ(offset, layer, 'black');
                    }
                }
            }
        }
    }
}


draw_circ(0, 0, 'red');
find();