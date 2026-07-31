import { useState } from "react";
import VisualizationArea from "./components/VisualizationArea";
import { defaultPoints } from "./data/defaultPoints";
import type { DistanceMetric } from "./types/geometry";
import "./App.css";

function App() {
  const [points, setPoints] = useState(defaultPoints);
  const [metric, setMetric] =
    useState<DistanceMetric>("euclidean");

  function resetPoints() {
    setPoints(defaultPoints);
  }

  function clearPoints() {
    setPoints([]);
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>Voronoi Diagram</h1>
        <p>The definition of distance determines the shape of space.</p>
      </header>

      <div className="app__main">
        <section>
          <VisualizationArea points={points} />

          <div className="app__commands">
            <button type="button" onClick={resetPoints}>
              Reset
            </button>

            <button type="button" onClick={clearPoints}>
              Clear
            </button>
          </div>
        </section>

        <aside className="app__sidebar">
          <label htmlFor="metric">Distance metric</label>

          <select
            id="metric"
            value={metric}
            onChange={(event) =>
              setMetric(event.target.value as DistanceMetric)
            }
          >
            <option value="euclidean">Euclidean</option>
            <option value="manhattan">Manhattan</option>
            <option value="chebyshev">Chebyshev</option>
          </select>

          <p>Points: {points.length}</p>
        </aside>
      </div>
    </main>
  );
}

export default App;