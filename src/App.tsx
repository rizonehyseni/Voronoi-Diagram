import {useCallback, useEffect,useRef, useState } from "react";
import VisualizationArea from "./components/VisualizationArea";
import { defaultPoints } from "./data/defaultPoints";
import { useGrowthAnimation } from "./hooks/useGrowthAnimation";
import type {
  DistanceMetric,
  Point2D,
} from "./types/geometry";
import "./App.css";

function getNextPointId(points: Point2D[]): string {
  const largestNumber = points.reduce((largest, point) => {
    const pointNumber = Number.parseInt(
      point.id.replace("P", ""),
      10,
    );

    if (Number.isNaN(pointNumber)) {
      return largest;
    }

    return Math.max(largest, pointNumber);
  }, 0);

  return `P${largestNumber + 1}`;
}

function App() {
  const [points, setPoints] =
    useState<Point2D[]>(defaultPoints);

  const [metric, setMetric] =
    useState<DistanceMetric>("euclidean");

  const [selectedPointId, setSelectedPointId] =
    useState<string | null>(null);

  const {
  progress: growthProgress,
  status: growthStatus,
  play: playGrowth,
  pause: pauseGrowth,
  showComplete: showCompleteGrowth,
} = useGrowthAnimation();

const previousGeometryRef = useRef({
  points,
  metric,
});

  function addPoint(x: number, y: number) {
    const newPoint: Point2D = {
      id: getNextPointId(points),
      x,
      y,
    };


    setPoints((currentPoints) => [
      ...currentPoints,
      newPoint,
    ]);

    setSelectedPointId(newPoint.id);
  }

  function movePoint(
    id: string,
    x: number,
    y: number,
  ) {
    setPoints((currentPoints) =>
      currentPoints.map((point) =>
        point.id === id
          ? { ...point, x, y }
          : point,
      ),
    );
  }

  const deleteSelectedPoint = useCallback(() => {
    if (!selectedPointId) {
      return;
    }

    setPoints((currentPoints) =>
      currentPoints.filter(
        (point) => point.id !== selectedPointId,
      ),
    );

    setSelectedPointId(null);
  }, [selectedPointId]);

  function clearPoints() {
    setPoints([]);
    setSelectedPointId(null);
  }

  useEffect(() => {
  const previousGeometry =
    previousGeometryRef.current;

  const pointsChanged =
    previousGeometry.points !== points;

  const metricChanged =
    previousGeometry.metric !== metric;

  if (!pointsChanged && !metricChanged) {
    return;
  }

  previousGeometryRef.current = {
    points,
    metric,
  };

  showCompleteGrowth();
}, [points, metric, showCompleteGrowth]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (
        event.key === "Delete" ||
        event.key === "Backspace"
      ) {
        deleteSelectedPoint();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [deleteSelectedPoint]);

  return (
    <main className="app">
      <header className="app__header">
        <h1>Voronoi Diagram</h1>

        <p>
        A geometric structure that divides a given space into the regions based on the distance to a set of the points.        </p>
      </header>

      <div className="app__main">
        <section>
          <VisualizationArea
            points={points}
            metric={metric}
            growthProgress={growthProgress}
            selectedPointId={selectedPointId}
            onAddPoint={addPoint}
            onMovePoint={movePoint}
            onSelectPoint={setSelectedPointId}
          />

          <div className="app__commands">
            <button type="button" onClick={clearPoints}>
              Clear
            </button>

            <button
              type="button"
              onClick={deleteSelectedPoint}
              disabled={!selectedPointId}
            >
              Delete selected
            </button>
            
            {growthStatus === "playing" ? (
  <button
    type="button"
    onClick={pauseGrowth}
  >
    Pause Growth
  </button>
) : (
  <button
    type="button"
    onClick={playGrowth}
  >
    {growthStatus === "paused"
      ? "Resume Growth"
      : "Play Growth"}
  </button>
)}

          </div>
        </section>

        <aside className="app__sidebar">
          <label className="metric-label" htmlFor="metric">
            Distance metric
          </label>

          <select
            className="metric-select"
            id="metric"
            value={metric}
            onChange={(event) =>
              setMetric(
                event.target.value as DistanceMetric,
              )
            }
          >
            <option value="euclidean">
              Euclidean
            </option>

            <option value="manhattan">
              Manhattan
            </option>

            <option value="chebyshev">
              Chebyshev
            </option>
          </select>

          <p>Points: {points.length}</p>

          <p>
            Selected:{" "}
            {selectedPointId ?? "None"}
          </p>
        </aside>
      </div>
    </main>
  );
}

export default App;
