import { KonvaEventObject } from "konva/lib/Node";
import React, { useCallback, useRef } from "react";
import {
  Stage,
  Layer,
  Rect as KonvaRect,
  Image as KonvaImage,
  Circle as KonvaCircle,
  Line as KonvaLine,
  Arrow as KonvaArrow,
  Transformer,
} from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { DrawAction } from "./Paint.constanst";
import { useStore } from "../store";
import { Rectangle } from "./Paint.types";
/* import { SketchPicker } from "react-color";
import { Download, Upload, XLg } from "react-bootstrap-icons"; */

interface PaintProps {}

export const Konva: React.FC<PaintProps> = React.memo(function Paint({}) {
  const [rectangles, setRectangles] = React.useState<Rectangle[]>([]);
  /* const [color, setColor] = useState("#000");
  const [drawAction, setDrawAction] = useState<DrawAction>(DrawAction.Select);
  const [scribbles, setScribbles] = useState<Scribble[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [image, setImage] = useState<HTMLImageElement>(); */

  /* color: string;
  setColor: (color: string) => void;
  drawAction: DrawAction;
  setDrawAction: (action: DrawAction) => void;
  scribbles: Scribble[];
  setScribbles: (scribbles: Scribble[]) => void;
  rectangles: Rectangle[];
  setRectangles: (rectangles: Rectangle[]) => void;
  circles: Circle[];
  setCircles: (circles: Circle[]) => void;
  arrows: Arrow[];
  setArrows: (arrows: Arrow[]) => void;
  image: HTMLImageElement | undefined;
  setImage: (image: HTMLImageElement | undefined) => void; */

  const color = useStore((state) => state.color);
  /* const setColor = useStore((state) => state.setColor); */
  const drawAction = useStore((state) => state.drawAction);
  /* const setDrawAction = useStore((state) => state.setDrawAction); */
  const scribbles = useStore((state) => state.scribbles);
  const setScribbles = useStore((state) => state.setScribbles);
  const rectanglesStore = useStore((state) => state.rectangles);
  const setRectanglesStore = useStore((state) => state.setRectangles);
  const circles = useStore((state) => state.circles);
  const setCircles = useStore((state) => state.setCircles);
  const arrows = useStore((state) => state.arrows);
  const setArrows = useStore((state) => state.setArrows);
  const image = useStore((state) => state.image);
  /* const setImage = useStore((state) => state.setImage); */

  const SIZE = 700;

  const isPaintRef = useRef(false);

  const onStageMouseUp = useCallback(() => {
    isPaintRef.current = false;
  }, []);

  const stageRef = useRef<any>(null);

  const currentShapeRef = useRef<string>();

  const onStageMouseDown = useCallback(
    async (e: KonvaEventObject<MouseEvent>) => {
      if (drawAction === DrawAction.Select) return;
      isPaintRef.current = true;
      const stage = stageRef?.current;
      const pos = stage?.getPointerPosition();
      const x = pos?.x || 0;
      const y = pos?.y || 0;
      const id = uuidv4();
      currentShapeRef.current = id;

      switch (drawAction) {
        case DrawAction.Scribble: {
          //@ts-ignore
          setScribbles((prevScribbles) => [
            ...prevScribbles,
            {
              id,
              points: [x, y],
              color,
            },
          ]);
          break;
        }
        case DrawAction.Circle: {
          //@ts-ignore
          setCircles((prevCircles) => [
            ...prevCircles,
            {
              id,
              radius: 1,
              x,
              y,
              color,
            },
          ]);
          break;
        }
        case DrawAction.Rectangle: {
          setRectangles((prevRectangles) => [
            ...prevRectangles,
            {
              id,
              height: 1,
              width: 1,
              x,
              y,
              color,
            },
          ]);
          setRectanglesStore(rectangles);
          break;
        }
        case DrawAction.Arrow: {
          //@ts-ignore
          setArrows((prevArrows) => [
            ...prevArrows,
            {
              id,
              points: [x, y, x, y],
              color,
            },
          ]);
          break;
        }
      }
    },
    [drawAction, color]
  );

  const onStageMouseMove = useCallback(() => {
    if (drawAction === DrawAction.Select || !isPaintRef.current) return;

    const stage = stageRef?.current;
    const id = currentShapeRef.current;
    const pos = stage?.getPointerPosition();
    const x = pos?.x || 0;
    const y = pos?.y || 0;

    switch (drawAction) {
      case DrawAction.Scribble: {
        //@ts-ignore
        setScribbles((prevScribbles) =>
          //@ts-ignore
          prevScribbles?.map((prevScribble) =>
            prevScribble.id === id
              ? {
                  ...prevScribble,
                  points: [...prevScribble.points, x, y],
                }
              : prevScribble
          )
        );
        break;
      }
      case DrawAction.Circle: {
        //@ts-ignore
        setCircles((prevCircles) =>
          //@ts-ignore
          prevCircles?.map((prevCircle) =>
            prevCircle.id === id
              ? {
                  ...prevCircle,
                  radius:
                    ((x - prevCircle.x) ** 2 + (y - prevCircle.y) ** 2) ** 0.5,
                }
              : prevCircle
          )
        );
        break;
      }
      case DrawAction.Rectangle: {
        //@ts-ignore
        setRectangles((prevRectangles) =>
          //@ts-ignore
          prevRectangles?.map((prevRectangle) =>
            prevRectangle.id === id
              ? {
                  ...prevRectangle,
                  height: y - prevRectangle.y,
                  width: x - prevRectangle.x,
                }
              : prevRectangle
          )
        );
        break;
      }
      case DrawAction.Arrow: {
        //@ts-ignore
        setArrows((prevArrows) =>
          //@ts-ignore
          prevArrows.map((prevArrow) =>
            prevArrow.id === id
              ? {
                  ...prevArrow,
                  points: [prevArrow.points[0], prevArrow.points[1], x, y],
                }
              : prevArrow
          )
        );
        break;
      }
    }
  }, [drawAction]);

  const transformerRef = useRef<any>(null);

  const onShapeClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (drawAction !== DrawAction.Select) return;
      const currentTarget = e.currentTarget;
      transformerRef?.current?.node(currentTarget);
    },
    [drawAction]
  );

  const isDraggable = drawAction === DrawAction.Select;

  const onBgClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      transformerRef?.current?.nodes([]);
    },
    [drawAction]
  );

  return (
    <div className="w-[85%] h-screen overflow-hidden border-black mt-4">
      <Stage
        height={SIZE}
        width={SIZE}
        ref={stageRef}
        onMouseUp={onStageMouseUp}
        onMouseDown={onStageMouseDown}
        onMouseMove={onStageMouseMove}
      >
        <Layer>
          <KonvaRect
            x={0}
            y={0}
            height={SIZE}
            width={SIZE}
            fill="white"
            id="bg"
            onClick={onBgClick}
          />
          {image && (
            <KonvaImage
              image={image}
              x={0}
              y={0}
              height={SIZE / 2}
              width={SIZE / 2}
              draggable={isDraggable}
            />
          )}
          {arrows.map((arrow) => (
            <KonvaArrow
              key={arrow.id}
              id={arrow.id}
              points={arrow.points}
              fill={arrow.color}
              stroke={arrow.color}
              strokeWidth={4}
              onClick={onShapeClick}
              draggable={isDraggable}
            />
          ))}
          {rectangles.map((rectangle) => (
            <KonvaRect
              key={rectangle.id}
              x={rectangle?.x}
              y={rectangle?.y}
              height={rectangle?.height}
              width={rectangle?.width}
              stroke={rectangle?.color}
              id={rectangle?.id}
              strokeWidth={4}
              onClick={onShapeClick}
              draggable={isDraggable}
            />
          ))}
          {circles.map((circle) => (
            <KonvaCircle
              key={circle.id}
              id={circle.id}
              x={circle?.x}
              y={circle?.y}
              radius={circle?.radius}
              stroke={circle?.color}
              strokeWidth={4}
              onClick={onShapeClick}
              draggable={isDraggable}
            />
          ))}
          {scribbles.map((scribble) => (
            <KonvaLine
              key={scribble.id}
              id={scribble.id}
              lineCap="round"
              lineJoin="round"
              stroke={scribble?.color}
              strokeWidth={4}
              points={scribble.points}
              onClick={onShapeClick}
              draggable={isDraggable}
            />
          ))}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
});
