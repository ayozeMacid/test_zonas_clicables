import React, { useEffect } from "react";
import { useCanvas } from "../hooks/useCanvas";
import { Coords } from "../types/Coords";

export const Canvas = () => {
  const { render, reference, addNewZone, getCanvasCoords, zoneCollection } =
    useCanvas();

  let originCoords: Coords | null = null;

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!originCoords) {
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    const destinationCoords: Coords = getCanvasCoords({ x, y });

    render({ origin: originCoords, destination: destinationCoords });
  };

  const handleClick = (event: React.MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    const destinationCoords: Coords = getCanvasCoords({ x, y });

    if (originCoords) {
      const url = prompt("Escribe la url asociada");
      addNewZone({ origin: originCoords, destination: destinationCoords, url });
      // render();
      originCoords = null;
    } else {
      originCoords = { ...destinationCoords };
    }
  };

  useEffect(() => {
    console.log({ zoneCollection });
  }, [zoneCollection]);

  return (
    <canvas
      id="canvas"
      height="500"
      width="500"
      ref={reference}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    ></canvas>
  );
};
