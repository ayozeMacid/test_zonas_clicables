import { ZoneSize } from "../components/konva-canvas/konva-canvas";
import { Coords } from "../types/Coords";

interface useClickableZonesParams {
  canvasPostion: Coords;
}
export const useClickableZones = ({
  canvasPostion,
}: useClickableZonesParams) => {
  const getCanvasCoords = (pointerCoords: Coords): Coords => {
    return {
      x: pointerCoords.x - canvasPostion.x,
      y: pointerCoords.y - canvasPostion.y,
    };
  };

  const calculateSize = (
    originPoint: Coords,
    destinationPoint: Coords
  ): ZoneSize => {
    return {
      width: destinationPoint.x - originPoint.x,
      height: destinationPoint.y - originPoint.y,
    };
  };
  return {
    getCanvasCoords,
    calculateSize,
  };
};
