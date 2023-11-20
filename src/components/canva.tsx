import React, { useEffect, useState } from "react";
import { useCanvas } from "../hooks/useCanvas";
import { Coords, CoordsMethods } from "../types/Coords";
import { Zone } from "../types/Zone";

import "./canva.css";

export const Canvas = () => {
  const {
    render,
    reference,
    addNewZone,
    getCanvasCoords,
    zoneCollection,
    isMovement,
    moveZone,
  } = useCanvas(
    "https://media.triumphmotorcycles.co.uk/image/upload/f_auto/q_auto/sitecoremedialibrary/media-library/images/home/hompage%20images/hpr/hpr-tr-series-500x500.jpg"
  );

  let originCoords: Coords | null = null;
  const [selectedZone, setSelectedZone] = useState<Zone | undefined>();

  const [isPointerCursor, setIsPointerCursor] = useState<boolean>(false);
  // const [isClicking, setIsClicking] = useState<boolean>(false);

  const changeCursor = (event: React.MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    const cursorCoords: Coords = getCanvasCoords({ x, y });

    if (isMovement(cursorCoords)) {
      setIsPointerCursor(true);
    } else {
      setIsPointerCursor(false);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    changeCursor(event);

    if (selectedZone) {
      const destinationCoords: Coords = getCanvasCoords({ x, y });
      const diff = CoordsMethods.substractCoords(
        selectedZone.origin,
        destinationCoords
      );
      moveZone(selectedZone.id, diff);
    }

    if (originCoords) {
      const destinationCoords: Coords = getCanvasCoords({ x, y });
      render({ origin: originCoords, destination: destinationCoords });
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    const destinationCoords: Coords = getCanvasCoords({ x, y });

    setSelectedZone(isMovement(destinationCoords));

    if (selectedZone) {
      return;
    }

    if (originCoords) {
      const url = prompt("Escribe la url asociada");
      addNewZone({
        origin: originCoords,
        destination: destinationCoords,
        url,
        id: Symbol(),
      });
      originCoords = null;
    } else {
      originCoords = { ...destinationCoords };
    }
  };

  // useEffect(() => {
  //   console.log({ zoneCollection });
  // }, [zoneCollection]);

  return (
    <canvas
      id="canvas"
      height="500"
      width="500"
      ref={reference}
      onClick={handleClick}
      // onMouseDown={() => setIsClicking(true)}
      onMouseMove={handleMouseMove}
      // onMouseUp={() => setIsClicking(false)}
      className={isPointerCursor && "cursorPointer"}
    ></canvas>
  );
};
