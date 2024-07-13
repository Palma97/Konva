import "./App.css";
import { Konva } from "./components/Konva";
import Bar from "./components/Bar";

function App() {
  return (
    <div className="w-full m-0 h-screen bg-black flex justify-center items-center">
      <Bar></Bar>
      <Konva></Konva>
    </div>
  );
}

export default App;
