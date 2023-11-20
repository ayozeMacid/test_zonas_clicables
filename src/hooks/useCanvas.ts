import { useEffect, useMemo, useRef, useState } from "react";
import { Coords } from "../types/Coords";
import { Square, Zone } from "../types/Zone";
export const useCanvas = () => {
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<CanvasRenderingContext2D>();
  const [canvasDescription, setCanvasDescription] = useState<DOMRect>();

  const [zoneCollection, setZoneCollection] = useState<Zone[]>([]);

  const clearCanvas = () => {
    canvas.clearRect(0, 0, canvasDescription.width, canvasDescription.height);
  };

  const drawSquare = (originPoint: Coords, destinationPoint: Coords) => {
    const width = destinationPoint.x - originPoint.x;
    const height = destinationPoint.y - originPoint.y;
    canvas.strokeRect(originPoint.x, originPoint.y, width, height);
  };

  const render = (temporal?: Square) => {
    clearCanvas();

    zoneCollection.forEach((zone) => {
      drawSquare(zone.origin, zone.destination);
    });

    if (temporal) {
      drawSquare(temporal.origin, temporal.destination);
    }
  };

  const addNewZone = (zone: Zone) => {
    setZoneCollection([...zoneCollection, zone]);
  };

  const getCanvasCoords = (pointerCoords: Coords): Coords => {
    return {
      x: pointerCoords.x - canvasDescription.x,
      y: pointerCoords.y - canvasDescription.y,
    };
  };

  useEffect(() => {
    const canvas = canvasElement.current.getContext("2d");
    canvas.setLineDash([2, 4]);
    setCanvas(canvas);
    setCanvasDescription(canvasElement.current.getBoundingClientRect());
  }, [canvasElement]);

  useEffect(() => {
    if (canvas) {
      render();
    }
  }, [zoneCollection]);

  return {
    reference: canvasElement,
    addNewZone,
    render,
    getCanvasCoords,
    zoneCollection: zoneCollection,
  };
};
