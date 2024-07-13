import React from "react";
import { PAINT_OPTIONS } from "../components/Paint.constanst";
import { useStore } from "../store";
import { SketchPicker } from "react-color";
import { Upload } from "react-bootstrap-icons";

export default function Bar() {
  const color = useStore((state) => state.color);
  const setColor = useStore((state) => state.setColor);
  const setDrawAction = useStore((state) => state.setDrawAction);
  const setTexts = useStore((state) => state.setTexts);
  const setRectangles = useStore((state) => state.setRectangles);
  const setCircles = useStore((state) => state.setCircles);
  const setArrows = useStore((state) => state.setArrows);
  const setScribbles = useStore((state) => state.setScribbles);
  const setImage = useStore((state) => state.setImage);
  const selectedItem = useStore((state) => state.selectedItem);

  const [active, setActive] = React.useState(true);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );

  //@ts-ignore
  const handleColor = (selectedColor) => {
    setColor(selectedColor.hex);
    setActive(!active);
  };

  const openMenu = () => {
    setActive(!active);
  };
  //@ts-ignore
  const handleClear = (e) => {
    const textNode = selectedItem;
    //@ts-ignore
    textNode.destroy();
  };

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

  const onClear = React.useCallback(() => {
    setRectangles([]);
    setCircles([]);
    setScribbles([]);
    setArrows([]);
    setImage(undefined);
    setTexts([]);
  }, []);

  const handleButtonClick = (id: any) => {
    setDrawAction(id);
    setSelectedOption(id);
  };

  return (
    <div className="w-[15%] ml-4 h-[80%] bg-tercery relative transition duration-[0.3s] flex justify-evenly border border-solid shadow-2xl border-black items-center border-x-4 rounded-2xl">
      <div className="w-full h-[100%] flex flex-col justify-evenly items-center">
        {PAINT_OPTIONS.map(({ id, label, icon }) => (
          <button
            className={`border border-solid transition duration-[0.3s] hover:bg-primary font-bold shadow-2xl border-black p-2 w-[80%] rounded-lg ${
              selectedOption === id ? "bg-primary" : "bg-secondary"
            }`}
            aria-label={label}
            key={id}
            //@ts-ignore
            icon={icon}
            //@ts-ignore
            onClick={() => handleButtonClick(id)}
          >
            {label}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="border border-solid transition duration-[0.3s] hover:bg-primary font-bold shadow-2xl border-black p-2 w-[80%] rounded-lg bg-secondary"
        >
          Clear
        </button>
        <button
          className="flex text-center hover:bg-primary transition duration-[0.3s] font-bold w-[80%] items-center justify-center bg-secondary border border-solid border-black p-2 rounded"
          onClick={onClear}
        >
          Clear All
        </button>
        {active ? (
          <div className="flex items-center justify-evenly border border-solid transition duration-[0.3s] hover:bg-primary font-bold shadow-2xl border-black p-2 w-[80%] rounded-lg bg-secondary cursor-pointer">
            <button onClick={openMenu}>Open Menú</button>
            <div
              style={{ background: color }}
              className="w-[15%] h-[80%] rounded"
            ></div>
          </div>
        ) : (
          <SketchPicker
            className="transition duration-[0.3s] absolute cursor-pointer font-bold  text-center rounded border border-solid border-black bg-secondary p-2 w-[80%]"
            color={color}
            onChangeComplete={handleColor}
          />
        )}
        <input
          type="file"
          ref={fileRef}
          onChange={onImportImageSelect}
          style={{ display: "none" }}
          accept="image/*"
        />
        <button
          className="flex items-center justify-evenly transition duration-[0.3s] border hover:bg-primary font-bold border-solid shadow-2xl border-black p-2 w-[80%] rounded-lg bg-secondary"
          //@ts-ignore
          variant="solid"
          onClick={onImportImageClick}
          size="sm"
        >
          {<Upload />} Import Image
        </button>
      </div>
    </div>
  );
}
