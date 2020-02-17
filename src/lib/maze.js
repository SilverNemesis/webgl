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

export function generateDungeon(width, height, windiness = 0.8) {
  const regions = [];
  let region = 0;

  const data = [];
  for (let y = 0; y < height; y++) {
    data.push(new Array(width).fill(1));
  }

  const incrementRegion = () => {
    region++;
  }

  const carveRegion = (data, pos, value) => {
    data[pos.y][pos.x] = value;
    regions[pos.y][pos.x] = region;
  }

  const my = data.length;
  const mx = data[0].length;
  for (let y = 0; y < my; y++) {
    regions.push(Array(mx).fill(0))
  }

  _addRooms(data, mx, my, incrementRegion, carveRegion, 256, 4);

  for (let y = 1; y < my; y += 2) {
    for (let x = 1; x < mx; x += 2) {
      if (data[y][x] !== 1) {
        continue;
      }

      region++;

      _createMaze(data, carveRegion, { x, y }, windiness);
    }
  }

  _connectRegions(data, mx, my, region, regions);

  _removeDeadEnds(data, mx, my);

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

function _addRooms(data, mx, my, incrementRegion, carveRegion, numRoomTries, roomExtraSize) {
  const rooms = [];
  for (let i = 0; i < numRoomTries; i++) {
    const size = (_range(1, 3 + roomExtraSize) << 1) + 1;
    let rectangularity = _range(0, 1 + size >> 1) << 1;
    let width = size;
    let height = size;
    if (_range(0, 1) === 0) {
      width += rectangularity;
    } else {
      height += rectangularity;
    }
    let x = (_range(0, (mx - width - 1) >> 1) << 1) + 1;
    let y = (_range(0, (my - height - 1) >> 1) << 1) + 1;
    if (x + width > mx - 1 || y + height > my - 1) {
      continue;
    }
    const room = { x, y, width, height };
    let overlaps = false;
    for (let j = 0; j < rooms.length; j++) {
      const other = rooms[j];
      if (_isOverlapped(room, other)) {
        overlaps = true;
        break;
      }
    }
    if (overlaps) {
      continue;
    }
    rooms.push(room);
    incrementRegion();
    for (let xOffset = 0; xOffset < width; xOffset++) {
      for (let yOffset = 0; yOffset < height; yOffset++) {
        carveRegion(data, { x: x + xOffset, y: y + yOffset }, 2);
      }
    }
  }
}

function _createMaze(data, carveRegion, start, windiness) {
  const my = data.length;
  const mx = data[0].length;
  const cells = [];
  let lastDir;
  carveRegion(data, start, 0);
  data[start.y][start.x] = 0;
  cells.push(start);
  while (cells.length > 0) {
    const cell = cells[cells.length - 1];
    const posCells = [];
    for (let i = 0; i < _directions.length; i++) {
      const dir = _directions[i];
      if (_canCarve(data, mx, my, cell, dir)) {
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
      const c1 = _addDir(cell, dir, 1);
      const c2 = _addDir(cell, dir, 2);
      carveRegion(data, c1, 0);
      carveRegion(data, c2, 0);
      cells.push(_addDir(cell, dir, 2));
      lastDir = dir;
    } else {
      cells.pop();
      lastDir = null;
    }
  }
}

function _connectRegions(data, mx, my, region, regions) {
  let connectors = [];
  for (let y = 1; y < my - 1; y++) {
    for (let x = 1; x < mx - 1; x++) {
      if (data[y][x] !== 1) {
        continue;
      }
      const connectedRegions = [];
      for (let i = 0; i < _directions.length; i++) {
        const dir = _directions[i];
        const region = regions[y + dir.y][x + dir.x];
        if (region !== 0 && !connectedRegions.includes(region)) {
          connectedRegions.push(region);
        }
      }
      if (connectedRegions.length < 2) {
        continue;
      }
      connectors.push({ x, y, regions: connectedRegions })
    }
  }
  const merged = [0];
  let openRegions = [];
  for (var i = 1; i <= region; i++) {
    merged.push(i);
    openRegions.push(i);
  }
  while (openRegions.length > 1) {
    const index = _range(0, connectors.length - 1)
    const connector = connectors[index];
    _carve(data, { x: connector.x, y: connector.y });
    const regions = connector.regions.map((region) => merged[region]);
    const dest = regions[0];
    const sources = regions.slice(1);
    for (let i = 0; i <= region; i++) {
      if (sources.includes(i)) {
        merged[i] = dest;
      }
    }
    openRegions = openRegions.filter((region) => {
      return !sources.includes(region);
    });
    connectors = connectors.filter((con) => {
      if (Math.abs(con.x - connector.x) <= 1 && Math.abs(con.y - connector.y) <= 1) {
        return false;
      }
      con.regions = con.regions.map((region) => merged[region]);
      for (let i = 1; i < con.regions.length; i++) {
        if (con.regions[i] !== con.regions[0]) {
          return true;
        }
      }
      if (_range(0, 99) === 0) {
        _carve(data, { x: con.x, y: con.y });
      }
      return false;
    });
  }
}

function _removeDeadEnds(data, mx, my) {
  let done = false;
  while (!done) {
    done = true;
    for (let y = 1; y < my - 1; y++) {
      for (let x = 1; x < mx - 1; x++) {
        if (data[y][x] === 1) {
          continue;
        }
        let exits = 0;
        for (let i = 0; i < _directions.length; i++) {
          const dir = _directions[i];
          if (data[y + dir.y][x + dir.x] !== 1) {
            exits++;
          }
        }
        if (exits !== 1) {
          continue;
        }
        done = false;
        _fill(data, { x, y });
      }
    }
  }
}

function _carve(data, pos) {
  data[pos.y][pos.x] = 0;
}

function _fill(data, pos) {
  data[pos.y][pos.x] = 1;
}

function _canCarve(data, mx, my, pos, dir) {
  if (!_isInBounds(mx, my, _addDir(pos, dir, 3))) {
    return false;
  }
  const nxt = _addDir(pos, dir, 2);
  return data[nxt.y][nxt.x] === 1;
}

function _isInBounds(mx, my, pos) {
  if (pos.x < 0 || pos.y < 0 || pos.x >= mx || pos.y >= my) {
    return false;
  }
  return true;
}

function _addDir(pos, dir, len) {
  return {
    x: pos.x + dir.x * len,
    y: pos.y + dir.y * len
  }
}

function _range(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _isOverlapped(pri, sec) {
  if (pri.x > sec.x + sec.width || sec.x > pri.x + pri.width) {
    return false;
  }
  if (pri.y > sec.y + sec.height || sec.y > pri.y + pri.height) {
    return false;
  }
  return true;
}
