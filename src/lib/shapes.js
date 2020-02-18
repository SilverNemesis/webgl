export function getShape(shape) {
  if (shape === 'tetrahedron') {
    const s3 = Math.sqrt(3);
    const s6 = Math.sqrt(6);

    const vertices = [
      [s3 / 3, -s6 / 3 * 0.333 + s6 * 0.025, 0],         // right
      [-s3 / 6, -s6 / 3 * 0.333 + s6 * 0.025, 1 / 2],    // left front
      [-s3 / 6, -s6 / 3 * 0.333 + s6 * 0.025, -1 / 2],   // left back
      [0, s6 / 3 * 0.666 + s6 * 0.025, 0]                // top
    ];

    const faces = [
      [0, 1, 2],
      [3, 1, 0],
      [3, 0, 2],
      [3, 2, 1]
    ];

    return { vertices, faces };
  }

  if (shape === 'cube') {
    const r = .35;

    const vertices = [
      [-r, -r, -r],
      [-r, -r, r],
      [r, -r, r],
      [r, -r, -r],
      [-r, r, -r],
      [-r, r, r],
      [r, r, r],
      [r, r, -r]
    ];

    const faces = [
      [0, 3, 2, 1],   // bottom
      [4, 5, 6, 7],   // top
      [0, 1, 5, 4],   // left
      [2, 3, 7, 6],   // right
      [1, 2, 6, 5],   // front
      [3, 0, 4, 7]    // back
    ];

    return { vertices, faces };
  }

  if (shape === 'octahedron') {
    const a = 1 / (2 * Math.sqrt(2)) * 1.3;
    const b = 1 / 2 * 1.3;

    const vertices = [
      [-a, 0, a],    // front left
      [a, 0, a],     // front right
      [a, 0, -a],    // back right
      [-a, 0, -a],   // back left
      [0, b, 0],     // top
      [0, -b, 0]     // bottom
    ];

    const faces = [
      [3, 0, 4],
      [2, 3, 4],
      [1, 2, 4],
      [0, 1, 4],
      [3, 2, 5],
      [0, 3, 5],
      [2, 1, 5],
      [1, 0, 5]
    ];

    return { vertices, faces };
  }

  if (shape === 'pentagonaltrapezohedron') {
    const height = 0.7;
    const radius = 0.5;
    let offset = 0.05;
    const vertices = [];
    const step = Math.PI / 5;
    for (var theta = 0; theta < 2 * Math.PI; theta += step) {
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      vertices.push([x, offset, y]);
      offset = -offset;
    }
    vertices.push([0, height, 0]);
    vertices.push([0, -height, 0]);

    const faces = [
      [10, 2, 1, 0],
      [10, 4, 3, 2],
      [10, 6, 5, 4],
      [10, 8, 7, 6],
      [10, 0, 9, 8],
      [11, 1, 2, 3],
      [11, 3, 4, 5],
      [11, 5, 6, 7],
      [11, 7, 8, 9],
      [11, 9, 0, 1]
    ];

    return { vertices, faces };
  }

  if (shape === 'dodecahedron') {
    const phi = (1 + Math.sqrt(5)) / 2;
    const a = 0.5;
    const b = 0.5 * 1 / phi;
    const c = 0.5 * (2 - phi);

    const vertices = [
      [c, 0, a],
      [-c, 0, a],
      [-b, b, b],
      [0, a, c],
      [b, b, b],
      [b, -b, b],
      [0, -a, c],
      [-b, -b, b],
      [c, 0, -a],
      [-c, 0, -a],
      [-b, -b, -b],
      [0, -a, -c],
      [b, -b, -b],
      [b, b, -b],
      [0, a, -c],
      [-b, b, -b],
      [a, c, 0],
      [-a, c, 0],
      [-a, -c, 0],
      [a, -c, 0]
    ];

    const faces = [
      [4, 3, 2, 1, 0],
      [7, 6, 5, 0, 1],
      [12, 11, 10, 9, 8],
      [15, 14, 13, 8, 9],
      [14, 3, 4, 16, 13],
      [3, 14, 15, 17, 2],
      [11, 6, 7, 18, 10],
      [6, 11, 12, 19, 5],
      [4, 0, 5, 19, 16],
      [12, 8, 13, 16, 19],
      [15, 9, 10, 18, 17],
      [7, 1, 2, 17, 18]
    ];

    return { vertices, faces };
  }

  if (shape === 'icosahedron') {
    const phi = (1 + Math.sqrt(5)) / 2;
    const a = 1 / 2;
    const b = 1 / (2 * phi);

    const vertices = [
      [0, b, -a],
      [b, a, 0],
      [-b, a, 0],
      [0, b, a],
      [0, -b, a],
      [-a, 0, b],
      [a, 0, b],
      [0, -b, -a],
      [a, 0, -b],
      [-a, 0, -b],
      [b, -a, 0],
      [-b, -a, 0]
    ];

    const faces = [
      [1, 0, 2],
      [2, 3, 1],
      [4, 3, 5],
      [6, 3, 4],
      [7, 0, 8],
      [9, 0, 7],
      [10, 4, 11],
      [11, 7, 10],
      [5, 2, 9],
      [9, 11, 5],
      [8, 1, 6],
      [6, 10, 8],
      [5, 3, 2],
      [1, 3, 6],
      [2, 0, 9],
      [8, 0, 1],
      [9, 7, 11],
      [10, 7, 8],
      [11, 4, 5],
      [6, 4, 10]
    ];

    return { vertices, faces };
  }
}
