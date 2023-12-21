import { useEffect, useRef, useState } from "react";
import { Coords, CoordsMethods } from "../types/Coords";
import { Square, Zone } from "../types/Zone";
export const useCanvas = (backgroundUrl?: string) => {
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<CanvasRenderingContext2D>();
  const [canvasDescription, setCanvasDescription] = useState<DOMRect>();

  const [zoneCollection, setZoneCollection] = useState<Zone[]>([]);

  const clearCanvas = () => {
    if (backgroundUrl) {
      setBackground(backgroundUrl);
    } else {
      canvas.clearRect(0, 0, canvasDescription.width, canvasDescription.height);
    }
  };

  const drawSquare = (originPoint: Coords, destinationPoint: Coords) => {
    const width = destinationPoint.x - originPoint.x;
    const height = destinationPoint.y - originPoint.y;
    canvas.fillRect(originPoint.x, originPoint.y, width, height);
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

  const moveZone = (zoneId: Zone["id"], coords: Coords) => {
    setZoneCollection((zoneCollection) => {
      const zone = zoneCollection.find((zone) => zone.id === zoneId);
      zone.origin = CoordsMethods.sumCoords(zone.origin, coords);
      zone.destination = CoordsMethods.sumCoords(zone.destination, coords);
      return zoneCollection;
    });
    render();
  };

  const getCanvasCoords = (pointerCoords: Coords): Coords => {
    return {
      x: pointerCoords.x - canvasDescription.x,
      y: pointerCoords.y - canvasDescription.y,
    };
  };

  const isMovement = (coords: Coords): Zone => {
    const x = zoneCollection.find(
      ({ origin, destination }) =>
        origin.x < coords.x &&
        destination.x > coords.x &&
        origin.y < coords.y &&
        destination.y > coords.y
    );
    return x;
  };

  const setBackground = (url: string) => {
    const image = new Image();
    image.src = url;
    canvas.drawImage(image, 0, 0);
  };

  useEffect(() => {
    const canvas = canvasElement.current.getContext("2d");
    canvas.setLineDash([2, 4]);
    canvas.strokeStyle = "white";
    canvas.fillStyle = "#ffffff7e";
    setCanvas(canvas);
    setCanvasDescription(canvasElement.current.getBoundingClientRect());

    const image = new Image();
    image.src = backgroundUrl;
    canvas.drawImage(image, 0, 0);
  }, [canvasElement]);

  useEffect(() => {
    if (canvas) {
      render();
    }
  }, [zoneCollection]);

  return {
    reference: canvasElement,
    addNewZone,
    moveZone,
    render,
    getCanvasCoords,
    zoneCollection: zoneCollection,
    isMovement,
    setBackground,
  };
};
