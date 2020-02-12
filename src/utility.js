export function degreesToRadians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

export function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = _loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = _loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

export function getShaderParameters(gl, shaderProgram) {
  const attributeCount = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
  const attributes = [];
  for (let i = 0; i < attributeCount; i++) {
    const attribute = gl.getActiveAttrib(shaderProgram, i);
    attributes.push({ name: attribute.name, type: _typeToString(gl, attribute.type) });
  }
  const uniformCount = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
  const uniforms = [];
  for (let i = 0; i < uniformCount; i++) {
    const uniform = gl.getActiveUniform(shaderProgram, i);
    uniforms.push({ name: uniform.name, type: _typeToString(gl, uniform.type) });
  }
  return {
    attributes,
    uniforms
  };
}

function _typeToString(gl, type) {
  switch (type) {
    case gl.FLOAT:
      return "FLOAT";
    case gl.FLOAT_VEC2:
      return "FLOAT_VEC2";
    case gl.FLOAT_VEC3:
      return "FLOAT_VEC3";
    case gl.FLOAT_VEC4:
      return "FLOAT_VEC4";
    case gl.INT:
      return "INT";
    case gl.INT_VEC2:
      return "INT_VEC2";
    case gl.INT_VEC3:
      return "INT_VEC3";
    case gl.INT_VEC4:
      return "INT_VEC4";
    case gl.BOOL:
      return "BOOL";
    case gl.BOOL_VEC2:
      return "BOOL_VEC2";
    case gl.BOOL_VEC3:
      return "BOOL_VEC3";
    case gl.BOOL_VEC4:
      return "BOOL_VEC4";
    case gl.FLOAT_MAT2:
      return "FLOAT_MAT2";
    case gl.FLOAT_MAT3:
      return "FLOAT_MAT3";
    case gl.FLOAT_MAT4:
      return "FLOAT_MAT4";
    case gl.SAMPLER_2D:
      return "SAMPLER_2D";
    case gl.SAMPLER_CUBE:
      return "SAMPLER_CUBE";
    default:
      return "UNKNOWN";
  }
}

function _loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
      srcFormat, srcType, image);
    if (_isPowerOf2(image.width) && _isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;
  return texture;
}

function _isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

export function clearScreen(gl) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

const _directions = [
  { x: -1, y: 0 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 }
];

export function generateMaze(width, height, windiness = 0.8) {
  const carve = (pos) => {
    data[pos.y][pos.x] = 0;
  }

  const canCarve = (pos, dir) => {
    if (!isInBounds(addDir(pos, dir, 3))) {
      return false;
    }
    const nxt = addDir(pos, dir, 2);
    return data[nxt.y][nxt.x] === 1;
  }

  const isInBounds = (pos) => {
    if (pos.x < 0 || pos.y < 0 || pos.x >= width || pos.y >= height) {
      return false;
    }
    return true;
  }

  const addDir = (pos, dir, len) => {
    return {
      x: pos.x + dir.x * len,
      y: pos.y + dir.y * len
    }
  }

  const data = [];
  for (let y = 0; y < height; y++) {
    data.push(new Array(width).fill(1));
  }

  const start = { x: 1, y: 1 };
  const cells = [];
  let lastDir;
  carve(start);
  cells.push(start);
  while (cells.length > 0) {
    const cell = cells[cells.length - 1];
    const posCells = [];
    for (let i = 0; i < _directions.length; i++) {
      const dir = _directions[i];
      if (canCarve(cell, dir)) {
        posCells.push(dir);
      }
    }
    if (posCells.length > 0) {
      let dir;
      if (posCells.includes(lastDir) && Math.random() > windiness) {
        dir = lastDir;
      } else {
        dir = posCells[Math.floor(Math.random() * posCells.length)];
      }
      carve(addDir(cell, dir, 1));
      carve(addDir(cell, dir, 2));
      cells.push(addDir(cell, dir, 2));
      lastDir = dir;
    } else {
      cells.pop();
      lastDir = null;
    }
  }
  return {
    width,
    height,
    data
  };
}

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
    const r = .3;

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
    const a = 1 / (2 * Math.sqrt(2));
    const b = 1 / 2;

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
    const vertices = [
      [0.210292440, 0.15278640, 0.340260320],
      [-0.08032456, 0.24721360, 0.340260320],
      [-0.25993576, 0.00000000, 0.340260320],
      [0.210292440, -0.6472136, 0.340260320],
      [0.420584800, 0.00000000, -0.08032456],
      [0.340260320, 0.24721360, 0.080324560],
      [-0.21029244, 0.64721360, -0.34026032],
      [-0.42058480, 0.00000000, 0.080324560],
      [-0.34026032, -0.2472136, -0.08032456],
      [0.080324560, -0.2472136, -0.34026032],
      [0.259935760, 0.00000000, -0.34026032],
      [-0.21029244, -0.1527864, -0.34026032]
    ];

    const faces = [
      [3, 0, 1, 2],
      [0, 3, 4, 5],
      [1, 0, 5, 6],
      [2, 1, 6, 7],
      [3, 2, 7, 8],
      [4, 3, 9, 10],
      [5, 4, 10, 6],
      [7, 6, 11, 8],
      [3, 8, 11, 9],
      [10, 9, 11, 6]
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

const _materials = {
  emerald: {
    ambient: [0.0215, 0.1745, 0.0215], diffuse: [0.07568, 0.61424, 0.07568], specular: [0.633, 0.727811, 0.633], shininess: 0.6
  },
  jade: {
    ambient: [0.135, 0.2225, 0.1575], diffuse: [0.54, 0.89, 0.63], specular: [0.316228, 0.316228, 0.316228], shininess: 0.1
  },
  obsidian: {
    ambient: [0.05375, 0.05, 0.06625], diffuse: [0.18275, 0.17, 0.22525], specular: [0.332741, 0.328634, 0.346435], shininess: 0.3
  },
  pearl: {
    ambient: [0.25, 0.20725, 0.20725], diffuse: [1, 0.829, 0.829], specular: [0.296648, 0.296648, 0.296648], shininess: 0.088
  },
  ruby: {
    ambient: [0.1745, 0.01175, 0.01175], diffuse: [0.61424, 0.04136, 0.04136], specular: [0.727811, 0.626959, 0.626959], shininess: 0.6
  },
  turquoise: {
    ambient: [0.1, 0.18725, 0.1745], diffuse: [0.396, 0.74151, 0.69102], specular: [0.297254, 0.30829, 0.306678], shininess: 0.1
  },
  brass: {
    ambient: [0.329412, 0.223529, 0.027451], diffuse: [0.780392, 0.568627, 0.113725], specular: [0.992157, 0.941176, 0.807843], shininess: 0.21794872
  },
  bronze: {
    ambient: [0.2125, 0.1275, 0.054], diffuse: [0.714, 0.4284, 0.18144], specular: [0.393548, 0.271906, 0.166721], shininess: 0.2
  },
  chrome: {
    ambient: [0.25, 0.25, 0.25], diffuse: [0.4, 0.4, 0.4], specular: [0.774597, 0.774597, 0.774597], shininess: 0.6
  },
  copper: {
    ambient: [0.19125, 0.0735, 0.0225], diffuse: [0.7038, 0.27048, 0.0828], specular: [0.256777, 0.137622, 0.086014], shininess: 0.1
  },
  gold: {
    ambient: [0.24725, 0.1995, 0.0745], diffuse: [0.75164, 0.60648, 0.22648], specular: [0.628281, 0.555802, 0.366065], shininess: 0.4
  },
  silver: {
    ambient: [0.19225, 0.19225, 0.19225], diffuse: [0.50754, 0.50754, 0.50754], specular: [0.508273, 0.508273, 0.508273], shininess: 0.4
  },
  blackPlastic: {
    ambient: [0.0, 0.0, 0.0], diffuse: [0.01, 0.01, 0.01], specular: [0.50, 0.50, 0.50], shininess: 0.25
  },
  cyanPlastic: {
    ambient: [0.0, 0.1, 0.06], diffuse: [0.0, 0.50980392, 0.50980392], specular: [0.50196078, 0.50196078, 0.50196078], shininess: 0.25
  },
  greenPlastic: {
    ambient: [0.0, 0.0, 0.0], diffuse: [0.1, 0.35, 0.1], specular: [0.45, 0.55, 0.45], shininess: 0.25
  },
  redPlastic: {
    ambient: [0.0, 0.0, 0.0], diffuse: [0.5, 0.0, 0.0], specular: [0.7, 0.6, 0.6], shininess: 0.25
  },
  whitePlastic: {
    ambient: [0.0, 0.0, 0.0], diffuse: [0.55, 0.55, 0.55], specular: [0.70, 0.70, 0.70], shininess: 0.25
  },
  yellowPlastic: {
    ambient: [0.0, 0.0, 0.0], diffuse: [0.5, 0.5, 0.0], specular: [0.60, 0.60, 0.50], shininess: 0.25
  },
  blackRubber: {
    ambient: [0.02, 0.02, 0.02], diffuse: [0.01, 0.01, 0.01], specular: [0.4, 0.4, 0.4], shininess: 0.078125
  },
  cyanRubber: {
    ambient: [0.0, 0.05, 0.05], diffuse: [0.4, 0.5, 0.5], specular: [0.04, 0.7, 0.7], shininess: 0.078125
  },
  greenRubber: {
    ambient: [0.0, 0.05, 0.0], diffuse: [0.4, 0.5, 0.4], specular: [0.04, 0.7, 0.04], shininess: 0.078125
  },
  redRubber: {
    ambient: [0.05, 0.0, 0.0], diffuse: [0.5, 0.4, 0.4], specular: [0.7, 0.04, 0.04], shininess: 0.078125
  },
  whiteRubber: {
    ambient: [0.05, 0.05, 0.05], diffuse: [0.5, 0.5, 0.5], specular: [0.7, 0.7, 0.7], shininess: 0.078125
  },
  yellowRubber: {
    ambient: [0.05, 0.05, 0.0], diffuse: [0.5, 0.5, 0.4], specular: [0.7, 0.7, 0.04], shininess: 0.078125
  }
};

export function getMaterial(name) {
  return _materials[name];
}
