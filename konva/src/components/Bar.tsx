import React from "react";
import { PAINT_OPTIONS } from "../components/Paint.constanst";
import { useStore } from "../store";
import { SketchPicker } from "react-color";
import { Download, Upload, XLg } from "react-bootstrap-icons";

export default function Bar() {
  const drawAction = useStore((state) => state.drawAction);
  const color = useStore((state) => state.color);
  const setColor = useStore((state) => state.setColor);
  const setDrawAction = useStore((state) => state.setDrawAction);
  const setRectangles = useStore((state) => state.setRectangles);
  const setCircles = useStore((state) => state.setCircles);
  const setArrows = useStore((state) => state.setArrows);
  const setScribbles = useStore((state) => state.setScribbles);
  const setImage = useStore((state) => state.setImage);

  const SIZE = 650;

  const onImportImageSelect = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const imageUrl = URL.createObjectURL(e.target.files?.[0]);
        const image = new Image(SIZE / 2, SIZE / 2);
        image.src = imageUrl;
        setImage(image);
      }
      e.target.files = null;
    },
    []
  );

  const fileRef = React.useRef<HTMLInputElement>(null);
  const onImportImageClick = React.useCallback(() => {
    fileRef?.current && fileRef?.current?.click();
  }, []);

  const stageRef = React.useRef<any>(null);

  const downloadURI = (uri: string | undefined, name: string) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri || "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onExportClick = React.useCallback(() => {
    const dataUri = stageRef?.current?.toDataURL({ pixelRatio: 3 });
    downloadURI(dataUri, "image.png");
  }, []);

  const onClear = React.useCallback(() => {
    setRectangles([]);
    setCircles([]);
    setScribbles([]);
    setArrows([]);
    setImage(undefined);
  }, []);

  return (
    <div className="w-[15%] m-4 flex justify-evenly items-center">
      <div className="w-full h-screen flex flex-col justify-evenly items-center">
        {PAINT_OPTIONS.map(({ id, label, icon }) => (
          <button
            aria-label={label}
            key={id}
            //@ts-ignore
            icon={icon}
            onClick={() => setDrawAction(id)}
            /* colorScheme={id === drawAction ? "whatsapp" : undefined} */
          >
            {label}
          </button>
        ))}
        <button onClick={onClear}>{<XLg />}</button>
        {/* <SketchPicker
          color={color}
          onChangeComplete={(selectedColor) => setColor(selectedColor.hex)}
        /> */}
        {/* <select value={color} onChange={}>
            <option value="black">Negro</option>
            <option value="green">Verde</option>
            <option value="yellow">Amarillo</option>
            <option value="red">Rojo</option>
          </select> */}
        <input
          type="file"
          ref={fileRef}
          onChange={onImportImageSelect}
          style={{ display: "none" }}
          accept="image/*"
        />
        <button
          /* leftIcon={<Upload />} */
          //@ts-ignore
          variant="solid"
          onClick={onImportImageClick}
          size="sm"
        >
          {<Upload />} Import Image
        </button>
        <button
          /* leftIcon={<Download />} */
          //@ts-ignore
          // colorScheme="whatsapp"
          // variant="solid"
          //@ts-ignore
          onClick={onExportClick}
          //size="sm"
        >
          {<Download />} Export
        </button>
      </div>
    </div>
  );
}
