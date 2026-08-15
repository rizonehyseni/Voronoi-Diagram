import { useEffect, useRef, useState } from "react";
import { getRegionColor } from "../geometry/colors";
import { createTessellationGrid } from "../geometry/grid";
import type {
  DistanceMetric,
  Point2D,
} from "../types/geometry";

interface VisualizationAreaProps {
  points: Point2D[];
  metric: DistanceMetric;
  growthProgress: number;
  selectedPointId: string | null;
  onAddPoint: (x: number, y: number) => void;
  onMovePoint: (
    id: string,
    x: number,
    y: number,
  ) => void;
  onSelectPoint: (id: string | null) => void;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);

  return [
    (value >> 16) & 255,
    (value >> 8) & 255,
    value & 255,
  ];
}

function VisualizationArea({
  points,
  metric,
  growthProgress,
  selectedPointId,
  onAddPoint,
  onMovePoint,
  onSelectPoint,
}: VisualizationAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [svgSize, setSvgSize] = useState({
    width: 1,
    height: 1,
  });

  const draggingPointIdRef =
    useRef<string | null>(null);

  const [previewPoint, setPreviewPoint] =
  useState<Point2D | null>(null);  

  useEffect(() => {
  const svg = svgRef.current;

  if (!svg) {
    return;
  }

  const activeSvg = svg;

  function updateSvgSize() {
    const bounds =
      activeSvg.getBoundingClientRect();

    setSvgSize((currentSize) => {
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);

      if (
        currentSize.width === width &&
        currentSize.height === height
      ) {
        return currentSize;
      }

      return { width, height };
    });
  }

  updateSvgSize();

  const resizeObserver = new ResizeObserver(
    updateSvgSize,
  );

  resizeObserver.observe(activeSvg);

  return () => {
    resizeObserver.disconnect();
  };
}, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const container = canvas.parentElement;

    if (!container) {
      return;
    }
    const activeCanvas = canvas;
    const activeContainer = container;
    const calculationPoints = previewPoint
      ? [...points, previewPoint]
      : points;

    function renderTessellation() {
      const context = activeCanvas.getContext("2d");

      if (!context) {
        return;
      }

      const bounds = activeContainer.getBoundingClientRect();
      const devicePixelRatio = window.devicePixelRatio || 1;
      const calculationScale = 0.5;

      const width = Math.max(
        1,
        Math.round(
          bounds.width *
            devicePixelRatio *
            calculationScale,
        ),
      );

      const height = Math.max(
        1,
        Math.round(
          bounds.height *
            devicePixelRatio *
            calculationScale,
        ),
      );

      activeCanvas.width = width;
      activeCanvas.height = height;

      context.imageSmoothingEnabled = false;

      if (calculationPoints.length === 0) {
        context.fillStyle = "#1b1e22";
        context.fillRect(0, 0, width, height);
        return;
      }

const grid = createTessellationGrid(
  width,
  height,
  calculationPoints,
  metric,
);

const normalizedGrowthProgress = Math.min(
  1,
  Math.max(0, growthProgress),
);

const growthThreshold =
  grid.maximumArrivalTime *
  normalizedGrowthProgress;

const imageData = context.createImageData(
  width,
  height,
);

const pixels = imageData.data;

const colors = calculationPoints.map((_, index) =>
  hexToRgb(getRegionColor(index)),
);

const backgroundColor: [number, number, number] = [
  27,
  30,
  34,
];

for (
  let cellIndex = 0;
  cellIndex < grid.owners.length;
  cellIndex += 1
) {
  const pixelIndex = cellIndex * 4;
  const arrivalTime =
    grid.arrivalTimes[cellIndex];

  if (arrivalTime > growthThreshold) {
    pixels[pixelIndex] = backgroundColor[0];
    pixels[pixelIndex + 1] = backgroundColor[1];
    pixels[pixelIndex + 2] = backgroundColor[2];
    pixels[pixelIndex + 3] = 255;

    continue;
  }

  const ownerIndex = grid.owners[cellIndex];

  if (ownerIndex < 0) {
    pixels[pixelIndex] = backgroundColor[0];
    pixels[pixelIndex + 1] = backgroundColor[1];
    pixels[pixelIndex + 2] = backgroundColor[2];
    pixels[pixelIndex + 3] = 255;

    continue;
  }

  const [red, green, blue] = colors[ownerIndex];

  pixels[pixelIndex] = red;
  pixels[pixelIndex + 1] = green;
  pixels[pixelIndex + 2] = blue;
  pixels[pixelIndex + 3] = 225;
}

context.putImageData(imageData, 0, 0);
}
    renderTessellation();

    const resizeObserver = new ResizeObserver(
      renderTessellation,
    );

    resizeObserver.observe(activeContainer);

    return () => {
      resizeObserver.disconnect();
    };
  }, [points, metric, previewPoint, growthProgress]);

  function getPointerCoordinates(
  event: React.PointerEvent<SVGSVGElement>,
) {
  const bounds =
    event.currentTarget.getBoundingClientRect();

  const x = Math.min(
    1,
    Math.max(
      0,
      (event.clientX - bounds.left) / bounds.width,
    ),
  );

  const y = Math.min(
    1,
    Math.max(
      0,
      (event.clientY - bounds.top) / bounds.height,
    ),
  );

  return { x, y };
}

function handlePointerDown(
  event: React.PointerEvent<SVGSVGElement>,
) {
  const target = event.target;

  const seedElement =
    target instanceof Element
      ? target.closest<SVGGElement>(
          "[data-seed-id]",
        )
      : null;

  const seedId =
    seedElement?.dataset.seedId ?? null;

  if (seedId) {
    setPreviewPoint(null);
    draggingPointIdRef.current = seedId;
    onSelectPoint(seedId);

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    return;
  }

  const coordinates = getPointerCoordinates(event);

  setPreviewPoint(null);
  onAddPoint(coordinates.x, coordinates.y);
}

function handlePointerMove(
  event: React.PointerEvent<SVGSVGElement>,
) {
  const coordinates = getPointerCoordinates(event);

  const draggingPointId =
    draggingPointIdRef.current;

  if (draggingPointId) {
    setPreviewPoint(null);

    onMovePoint(
      draggingPointId,
      coordinates.x,
      coordinates.y,
    );

    return;
  }

  if (event.pointerType === "mouse") {
    setPreviewPoint({
      id: "__preview__",
      x: coordinates.x,
      y: coordinates.y,
    });
  }
}

function handlePointerUp(
  event: React.PointerEvent<SVGSVGElement>,
) {
  draggingPointIdRef.current = null;

  if (
    event.currentTarget.hasPointerCapture(
      event.pointerId,
    )
  ) {
    event.currentTarget.releasePointerCapture(
      event.pointerId,
    );
  }
}

function handlePointerLeave() {
  if (!draggingPointIdRef.current) {
    setPreviewPoint(null);
  }
}

  return (
    <div className="visualization">
      <canvas
        ref={canvasRef}
        className="visualization__canvas"
      />

      <svg
        ref={svgRef}
        className="visualization__overlay"
        viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
        preserveAspectRatio="none"
        aria-label="Voronoi seed points"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        {points.map((point) => (
          <g
            key={point.id}
            data-seed-id={point.id}
            className={
              point.id === selectedPointId
                ? "seed seed--selected"
                : "seed"
            }
          >
            <circle
              className="seed__hit-area"
              cx={point.x * svgSize.width}
              cy={point.y * svgSize.height}
              r="12"
            />

            <circle
              className="seed__dot"
              cx={point.x * svgSize.width}
              cy={point.y * svgSize.height}
              r="4.5"
              vectorEffect="non-scaling-stroke"
            />

            <text
              x={point.x * svgSize.width + 9}
              y={point.y * svgSize.height - 9}
              vectorEffect="non-scaling-stroke"
            >
              {point.id}
            </text>
          </g>
        ))}
        {previewPoint && (
          <g className="seed-preview">
            <circle
              cx={previewPoint.x * svgSize.width}
              cy={previewPoint.y * svgSize.height}
              r="5"
              vectorEffect="non-scaling-stroke"
            />

            <text
              x={previewPoint.x * svgSize.width + 9}
              y={previewPoint.y * svgSize.height - 9}
              
              vectorEffect="non-scaling-stroke"
            >
              Click to place
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export default VisualizationArea;