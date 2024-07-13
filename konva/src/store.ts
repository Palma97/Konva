import create from "zustand";
import {
  Arrow,
  Circle,
  Rectangle,
  Scribble,
  Text,
} from "./components/Paint.types";
import { DrawAction } from "./components/Paint.constanst";

interface StoreState {
  color: string;
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
  texts: Text[];
  setTexts: (texts: Text[]) => void;
  image: HTMLImageElement | undefined;
  setImage: (image: HTMLImageElement | undefined) => void;
}

export const useStore = create<StoreState>((set) => ({
  color: "#000",
  setColor: (colors) => set({ color: colors }),
  drawAction: DrawAction.Select,
  setDrawAction: (id) => set({ drawAction: id }),
  scribbles: [],
  setScribbles: (arrayScr) => set({ scribbles: arrayScr }),
  rectangles: [],
  setRectangles: (arrayRect) => set({ rectangles: arrayRect }),
  texts: [],
  setTexts: (arrayText) => set({ texts: arrayText }),
  arrows: [],
  setArrows: (arrayArrow) => set({ arrows: arrayArrow }),
  circles: [],
  setCircles: (arrayCir) => set({ circles: arrayCir }),
  image: undefined,
  setImage: (image1) => set({ image: image1 }),
}));
