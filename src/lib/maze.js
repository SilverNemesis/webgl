import { degreesToRadians } from './utility';

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

export function getMazeStartLocation(map) {
  const { width, height, data } = map;
  const isSolid = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return true;
    }
    if (data[y][x] === 1) {
      return true;
    }
    return false;
  }
  const ofs_x = -width / 2;
  const ofs_y = -height / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[y][x] !== 1) {
        let angle = 0.0;
        const matrix = [];
        for (let r = -1; r < 2; r++) {
          for (let c = -1; c < 2; c++) {
            if (isSolid(x + c, y + r)) {
              matrix.push('1');
            } else {
              matrix.push('0');
            }
          }
        }
        let tx, ty;
        if (matrix[0] === '0') {
          tx = x + 1;
          ty = y + 1;
          angle = -45.0;
        } else if (matrix[2] === '0') {
          tx = x - 1;
          ty = y + 1;
          angle = 45.0;
        } else if (matrix[6] === '0') {
          tx = x + 1;
          ty = y - 1;
          angle = -225.0;
        } else if (matrix[8] === '0') {
          tx = x - 1;
          ty = y - 1;
          angle = 225.0;
        } else if (matrix[3] === '0') {
          tx = x - 1;
          ty = y;
          angle = 90.0;
        } else if (matrix[5] === '0') {
          tx = x + 1;
          ty = y;
          angle = -90.0;
        } else if (matrix[7] === '0') {
          tx = x;
          ty = y + 1;
          angle = 180.0;
        } else {
          tx = x;
          ty = y - 1;
          angle = 0.0;
        }
        return { location: [x + ofs_x + 0.5, 0.5, y + ofs_y + 0.5], angle: degreesToRadians(angle), square: { x, y }, nextSquare: { x: tx, y: ty } };
      }
    }
  }
  return { location: [0.0, 0.5, 0.0] };
}

export function getMazeBoundingSquares(map) {
  const { width, height, data } = map;
  const mapBounds = [];
  const ofs_x = -width / 2;
  const ofs_y = -height / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[y][x] === 1) {
        mapBounds.push({ x1: x + ofs_x, y1: y + ofs_y, x2: x + ofs_x + 1, y2: y + ofs_y + 1 });
      }
    }
  }
  return mapBounds;
}

export function getMazeSquareCenter(map, x, y, z) {
  const { width, height } = map;
  const ofs_x = -width / 2;
  const ofs_y = -height / 2;
  return [x + ofs_x + 0.5, z, y + ofs_y + 0.5]
}
