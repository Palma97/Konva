import {
  ArrowUpLeft,
  ArrowUpLeftSquareFill,
  Circle,
  Pencil,
  Square,
} from "react-bootstrap-icons";

export enum DrawAction {
  Select = "select",
  Rectangle = "rectangle",
  Circle = "circle",
  Scribble = "freedraw",
  Arrow = "arrow",
  Text = "text",
}

export const PAINT_OPTIONS = [
  {
    id: DrawAction.Select,
    label: "Select Shapes",
    icon: <ArrowUpLeftSquareFill />,
  },
  { id: DrawAction.Rectangle, label: "Draw Rectangle", icon: <Square /> },
  { id: DrawAction.Circle, label: "Draw Circle", icon: <Circle /> },
  { id: DrawAction.Arrow, label: "Draw Arrow", icon: <ArrowUpLeft /> },
  { id: DrawAction.Scribble, label: "Scribble", icon: <Pencil /> },
  { id: DrawAction.Text, label: "Text", icon: <Pencil /> },
];
