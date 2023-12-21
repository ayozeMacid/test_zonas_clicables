import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { useClickableZones } from "../../hooks/useClickableZones";
import { Coords } from "../../types/Coords";
import { RectangleZone } from "./rectangle-zone";

import "./konva-canvas.css";
import { KonvaEventObject } from "konva/lib/Node";

export type ZoneSize = {
  width: number;
  height: number;
};
export type KonvaZone = ZoneSize & {
  position: Coords;
  id: string;
};

const idGeneratorSrc = function* (): Generator<string> {
  let id = 0;
  while (true) yield (id++).toString();
};

const idGenerator = idGeneratorSrc();
const generateId = (): string => idGenerator.next().value;

const KonvaZoneMethods = {
  createEmptyZone: (position: Coords): KonvaZone => ({
    width: 0,
    height: 0,
    position,
    id: generateId(),
  }),
};
export const KonvaCanvas = () => {
  const canvasElement = useRef(null);

  const [zoneCollection, setZoneCollection] = useState<KonvaZone[]>([]);
  const [canvasPostion, setCanvasPosition] = useState<Coords>();
  const [currentZone, setCurrentZone] = useState<KonvaZone | undefined>();
  const [selectedZone, setSelectedZone] = useState<KonvaZone | undefined>(
    undefined
  );

  const { getCanvasCoords, calculateSize } = useClickableZones({
    canvasPostion,
  });

  useLayoutEffect(() => {
    const domRect =
      canvasElement?.current.attrs.container.getBoundingClientRect();
    setCanvasPosition({
      x: domRect.x,
      y: domRect.y,
    });
  }, []);

  useEffect(() => {
    console.log({ zoneCollection });
  }, [zoneCollection]);

  const startZoneCreation = (event: KonvaEventObject<MouseEvent>) => {
    const cursorPosition: Coords = {
      x: event.evt.clientX,
      y: event.evt.clientY,
    };
    const canvasCursorPointer = getCanvasCoords(cursorPosition);
    const newZone = KonvaZoneMethods.createEmptyZone(canvasCursorPointer);
    setCurrentZone(newZone);
  };

  const continueZoneCreation = (event: KonvaEventObject<MouseEvent>) => {
    if (!currentZone) {
      return;
    }

    const cursorPosition: Coords = {
      x: event.evt.clientX,
      y: event.evt.clientY,
    };
    const canvasCursorPointer = getCanvasCoords(cursorPosition);

    const size = calculateSize(currentZone.position, canvasCursorPointer);
    setCurrentZone((prev) => ({ ...prev, ...size }));
  };

  const endZoneCreation = () => {
    if (!currentZone) {
      return;
    }
    setZoneCollection([...zoneCollection, currentZone]);
    setCurrentZone(undefined);
  };

  const onSelectZone = (zone: KonvaZone) => {
    setSelectedZone(zone);
  };

  const unSelectZone = (e: KonvaEventObject<MouseEvent>) => {
    const isEmptyZone = e.target === e.target.getStage();
    if (isEmptyZone) {
      setSelectedZone(undefined);
    }
  };

  const updateDataOnDrag = (e: KonvaEventObject<DragEvent>) => {
    const zoneId = e.target.id();
    const updatedCoords: Coords = e.target.position();

    setZoneCollection((oldZoneCollection) => {
      const zoneCollection = [...oldZoneCollection];
      const zone = oldZoneCollection.find((zone) => zone.id === zoneId);
      zone.position = updatedCoords;
      return zoneCollection;
    });
  };

  const updateDataOnResize = (data) => {
    setZoneCollection((oldZoneCollection) => {
      const zoneCollection = [...oldZoneCollection];
      const zone = oldZoneCollection.find((zone) => zone.id === data.id);
      zone.height = data.height;
      zone.width = data.width;
      return zoneCollection;
    });
  };

  return (
    <Stage
      width={500}
      height={500}
      ref={canvasElement}
      onClick={unSelectZone}
      onDblClick={startZoneCreation}
      onMouseMove={continueZoneCreation}
      onMouseUp={endZoneCreation}
      className="canvas"
    >
      <Layer>
        {zoneCollection.map((zone) => (
          <RectangleZone
            zone={zone}
            isSelected={zone.id === selectedZone?.id}
            key={zone.id.toString()}
            onClick={() => {
              onSelectZone(zone);
            }}
            onDragEnd={updateDataOnDrag}
            onResizeEnd={updateDataOnResize}
          />
        ))}
        {currentZone && <RectangleZone zone={currentZone} />}
      </Layer>
    </Stage>
  );
};
