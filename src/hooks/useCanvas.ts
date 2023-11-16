import React, { useEffect, useRef } from "react";
import { Coords } from "../types/Coords";
import { Square } from "../types/Square";
export const useCanvas = () => {
  const canvasElement = useRef<HTMLCanvasElement>(null);
  let canvas: CanvasRenderingContext2D;
  let canvasDescription: DOMRect;

  const zoneCollection: Array<Square> = [];

  const clearCanvas = () => {
    canvas.clearRect(0, 0, canvasDescription.width, canvasDescription.height);
  };

  const drawSquare = (originPoint: Coords, destinationPoint: Coords) => {
    const width = destinationPoint.x - originPoint.x;
    const height = destinationPoint.y - originPoint.y;
    canvas.strokeRect(originPoint.x, originPoint.y, width, height);
  };

  const render = (temporal: Square) => {
    clearCanvas();

    zoneCollection.forEach((zone) => {
      drawSquare(zone.origin, zone.destination);
    });

    drawSquare(temporal.origin, temporal.destination);
  };

  const addNewZone = (zone: Square) => {
    zoneCollection.push(zone);
  };

  useEffect(() => {
    canvas = canvasElement.current.getContext("2d");
    canvasDescription = canvasElement.current.getBoundingClientRect();
    canvas.setLineDash([2, 4]);
  }, [canvasElement]);

  return {
    reference: canvasElement,
    addNewZone,
    render,
  };
};
