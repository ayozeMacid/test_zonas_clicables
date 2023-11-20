export interface Coords {
  x: number;
  y: number;
}

export const CoordsMethods = {
  sumCoords: (origin: Coords, destination: Coords): Coords => {
    return {
      x: origin.x + destination.x,
      y: origin.y + destination.y,
    };
  },
  substractCoords: (origin: Coords, destination: Coords): Coords => {
    return {
      x: destination.x - origin.x,
      y: destination.y - origin.y,
    };
  },
};
