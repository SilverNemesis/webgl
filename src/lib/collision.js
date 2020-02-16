export function collideRectangles(r1, r2) {
  if (r1.x2 <= r2.x1 || r1.x1 >= r2.x2 || r1.y2 <= r2.y1 || r1.y1 >= r2.y2) {
    return false;
  }
  return true;
}

export function collideCircles(cx, cy, radius, tx, ty, targetRadius) {
  const distance = (cx - tx) * (cx - tx) + (cy - ty) * (cy - ty);
  if (distance < (radius + targetRadius) * (radius + targetRadius)) {
    return true;
  }
  return false;
}

export function collideCircleRectangle(cx, cy, radius, x1, y1, x2, y2) {
  const epsilon = 0.1;
  let type = 0;
  let testX = cx;
  let testY = cy;
  if (cx < x1 - epsilon) {
    type |= 1;
    testX = x1;
  } else if (cx > x2 + epsilon) {
    type |= 1;
    testX = x2;
  }
  if (cy < y1 - epsilon) {
    type |= 2;
    testY = y1;
  } else if (cy > y2 + epsilon) {
    type |= 2;
    testY = y2;
  }
  const distX = cx - testX;
  const distY = cy - testY;
  const distance = (distX * distX) + (distY * distY);
  if (distance <= radius * radius) {
    return type;
  }
  return 0;
}
