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
  Text as KonvaText,
  Transformer,
} from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { DrawAction } from "./Paint.constanst";
import { useStore } from "../store";
import { Rectangle, Scribble, Circle, Arrow, Text } from "./Paint.types";

interface PaintProps {}
//@ts-ignore

export const Konva: React.FC<PaintProps> = React.memo(function Paint({}) {
  const rectanglesStore = useStore((state) => state.rectangles);
  const [rectangles, setRectangles] = React.useState<Rectangle[]>([]);
  const [scribbles, setScribbles] = React.useState<Scribble[]>([]);
  const [circles, setCircles] = React.useState<Circle[]>([]);
  const [arrows, setArrows] = React.useState<Arrow[]>([]);
  const [texts, setTexts] = React.useState<Text[]>([]);
  const [editingText, setEditingText] = React.useState<{
    id: string;
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const handleTextDblClick = (e: KonvaEventObject<MouseEvent>) => {
    const textNode = e.target;
    const textPosition = textNode.getAbsolutePosition();
    setEditingText({
      //@ts-ignore
      id: textNode.id(),
      x: textPosition.x,
      y: textPosition.y,
      //@ts-ignore
      text: textNode.attrs.text,
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText((prev) => (prev ? { ...prev, text: e.target.value } : null));
  };

  const handleTextBlur = () => {
    if (!editingText) return;
    //@ts-ignore
    const { id, text } = editingText;
    setTexts((prevTexts) =>
      //@ts-ignore
      prevTexts.map((t) => (t.id === id ? { ...t, text } : t))
    );
    setEditingText(null);
  };

  const color = useStore((state) => state.color);
  const drawAction = useStore((state) => state.drawAction);
  const scribblesStore = useStore((state) => state.scribbles);
  const setScribblesStore = useStore((state) => state.setScribbles);
  const textsStore = useStore((state) => state.texts);
  const setTextsStore = useStore((state) => state.setTexts);
  const setRectanglesStore = useStore((state) => state.setRectangles);
  const circlesStore = useStore((state) => state.circles);
  const setCirclesStore = useStore((state) => state.setCircles);
  const arrowsStore = useStore((state) => state.arrows);
  const setArrowsStore = useStore((state) => state.setArrows);
  const image = useStore((state) => state.image);
  const setSelectedItem = useStore((state) => state.setSelectedItem);

  const stageRef = useRef<any>(null);

  React.useEffect(() => {
    setRectangles(rectanglesStore);
  }, [rectanglesStore]);

  React.useEffect(() => {
    setScribbles(scribblesStore);
  }, [scribblesStore]);

  React.useEffect(() => {
    setCircles(circlesStore);
  }, [circlesStore]);

  React.useEffect(() => {
    setArrows(arrowsStore);
  }, [arrowsStore]);

  React.useEffect(() => {
    setTexts(textsStore);
  }, [textsStore]);

  const SIZE = window.innerWidth;

  const isPaintRef = useRef(false);

  const onStageMouseUp = useCallback(() => {
    isPaintRef.current = false;
  }, []);

  const currentShapeRef = useRef<string>();

  const onStageMouseDown = useCallback(
    //@ts-ignore
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
          setScribblesStore(scribbles);
          break;
        }
        case DrawAction.Text: {
          //@ts-ignore
          setTexts((prevTexts) => [
            ...prevTexts,
            {
              id,
              text: "Nuevo texto",
              x,
              y,
              color,
            },
          ]);
          setTextsStore(texts);
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
          setCirclesStore(circles);
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
        case DrawAction.Text: {
          setTexts((prevTexts) => [
            ...prevTexts,
            {
              id,
              text: "Nuevo texto",
              height: 1,
              width: 1,
              x,
              y,
              color,
            },
          ]);
          setTextsStore(texts);
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
          setArrowsStore(arrows);
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
        setScribblesStore(scribbles);
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
        setCirclesStore(circles);
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
        setRectanglesStore(rectangles);
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
        setArrowsStore(arrows);
        break;
      }
    }
  }, [drawAction]);

  const transformerRef = useRef<any>(null);

  const onShapeClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (drawAction !== DrawAction.Select) return;
      const currentTarget = e.currentTarget;
      setSelectedItem(currentTarget);
      transformerRef?.current?.node(currentTarget);
    },
    [drawAction]
  );

  const isDraggable = drawAction === DrawAction.Select;

  const onBgClick = useCallback(
    //@ts-ignore
    (e: KonvaEventObject<MouseEvent>) => {
      transformerRef?.current?.nodes([]);
    },
    [drawAction]
  );

  return (
    <div className="w-[75%] h-[80%] hover:cursor-crosshair overflow-hidden border-black rounded-xl shadow-2xl">
      <Stage
        height={SIZE}
        width={SIZE}
        ref={stageRef}
        className="border border-solid border-black"
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
              height={SIZE / 3}
              width={SIZE / 3}
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
          {texts.map((text) => (
            <KonvaText
              key={text.id}
              id={text.id}
              text={text.text}
              x={text.x}
              y={text.y}
              fill={text.color}
              fontSize={20}
              draggable={isDraggable}
              onClick={onShapeClick}
              onDblClick={handleTextDblClick}
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
      {editingText && (
        <input
          style={{
            position: "absolute",
            top: editingText.y,
            left: editingText.x,
            fontSize: "20px",
            border: "1px solid black",
            backgroundColor: "white",
          }}
          value={editingText.text}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          autoFocus
        />
      )}
    </div>
  );
});
