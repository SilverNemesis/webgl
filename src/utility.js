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
