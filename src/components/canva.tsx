import React, { useRef, useEffect } from "react";
import { useCanvas } from "../hooks/useCanvas";
import { Coords } from "../types/Coords";
import { Square } from "../types/Square";

type SquareCoords = Record<"A" | "B" | "C" | "D", Coords>;

export const Canvas = () => {
  const canvasElement = useRef<HTMLCanvasElement>(null);
  let canvas: CanvasRenderingContext2D;
  let canvasPosition = { x: 0, y: 0 };

  const squareCollection: Array<Square> = [];

  let originCoords: Coords | null = null;

  const calculateSquareCoords = (
    originPoint: Coords,
    destinationPoint: Coords
  ): SquareCoords => {
    return {
      A: originPoint,
      B: {
        x: destinationPoint.x,
        y: originPoint.y,
      },
      C: {
        x: destinationPoint.y,
        y: originPoint.x,
      },
      D: destinationPoint,
    };
  };

  const render = (tempSquare: Square) => {
    canvas.clearRect(0, 0, 500, 500); // reset screen
    squareCollection.forEach((square) => {
      drawSquare(square.origin, square.destination);
    });
    drawSquare(tempSquare.origin, tempSquare.destination);
  };

  const drawSquare = (originPoint: Coords, destinationPoint: Coords) => {
    const width = destinationPoint.x - originPoint.x;
    const height = destinationPoint.y - originPoint.y;
    canvas.strokeRect(originPoint.x, originPoint.y, width, height);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!originCoords) {
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    const destinationCoords: Coords = {
      x: x - canvasPosition.x,
      y: y - canvasPosition.y,
    };

    render({ origin: originCoords, destination: destinationCoords });
    // drawSquare(originCoords, destinationCoords);
  };

  const handleClick = (event: React.MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    const destinationCoords: Coords = {
      x: x - canvasPosition.x,
      y: y - canvasPosition.y,
    };

    if (originCoords) {
      drawSquare(originCoords, destinationCoords);
      console.log(calculateSquareCoords(originCoords, destinationCoords));
      squareCollection.push({
        origin: originCoords,
        destination: destinationCoords,
      });
      originCoords = null;
    } else {
      originCoords = { ...destinationCoords };
    }
  };

  useEffect(() => {
    canvas = canvasElement.current.getContext("2d");
    canvas.setLineDash([2, 4]);
    const { x, y, height, width } =
      canvasElement.current.getBoundingClientRect();
    canvasPosition = { x, y };
  }, [canvasElement]);

  return (
    <canvas
      id="canvas"
      height="500"
      width="500"
      ref={canvasElement}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    ></canvas>
  );
};
