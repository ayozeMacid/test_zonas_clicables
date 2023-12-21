import { Rect, Transformer } from "react-konva";
import { Coords } from "../../types/Coords";
import { useEffect, useRef } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { KonvaZone, ZoneSize } from "./konva-canvas";

interface RectangleZoneParams {
  zone: KonvaZone;
  isSelected?: boolean;
  onClick?: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd?: (e: KonvaEventObject<DragEvent>) => void;
  onResizeEnd?: (size: ZoneSize & { id: string }) => void;
}
export const RectangleZone = ({
  zone,
  isSelected = false,
  onClick,
  onDragEnd,
  onResizeEnd,
}: RectangleZoneParams) => {
  const transformerRef = useRef<any>();
  const shapeRef = useRef<any>();

  useEffect(() => {
    if (!isSelected) {
      return;
    }
    transformerRef.current.nodes([shapeRef.current]);
    transformerRef.current.getLayer().batchDraw();
  }, [isSelected]);
  return (
    <>
      <Rect
        height={zone.height}
        width={zone.width}
        x={zone.position?.x}
        y={zone.position?.y}
        id={zone.id.toString()}
        stroke="lightblue"
        strokeWidth={1}
        draggable
        ref={shapeRef}
        onClick={onClick}
        onDragEnd={onDragEnd}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          const size: ZoneSize = {
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          };
          onResizeEnd({ ...size, id: e.target.id() });
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          anchorSize={10}
          anchorCornerRadius={50}
          rotateEnabled={true}
        />
      )}
    </>
  );
};
