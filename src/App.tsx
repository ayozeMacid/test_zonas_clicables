import { FC, useState } from "react";

import { Canvas } from "./components/canva";

import "./style.css";
import { KonvaCanvas } from "./components/konva-canvas/konva-canvas";

export const App: FC<{ name: string }> = ({ name }) => {
  const [isUsingLibrary, setIsUsingLibrary] = useState<boolean>(true);
  const toggleIsUsingLibrary = () => setIsUsingLibrary((state) => !state);

  return (
    <section>
      <div>
        <label htmlFor="library">
          <span>Use konva library</span>
          <input
            type="radio"
            name="library"
            id="library"
            checked={isUsingLibrary}
            onClick={toggleIsUsingLibrary}
          />
        </label>
        <label htmlFor="native">
          <span>Use native solution</span>
          <input
            type="radio"
            name="library"
            id="native"
            checked={!isUsingLibrary}
            onClick={toggleIsUsingLibrary}
          />
        </label>
      </div>
      {isUsingLibrary ? <KonvaCanvas /> : <Canvas />}
    </section>
  );
};
