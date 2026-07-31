import { useEffect, useRef } from "react";
import { getRegionColor } from "../geometry/colors";
import { findNearestPointIndex } from "../geometry/tessellation";
import type {
  DistanceMetric,
  Point2D,
} from "../types/geometry";

interface VisualizationAreaProps {
  points: Point2D[];
  metric: DistanceMetric;
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
}: VisualizationAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    function renderTessellation() {
      const context = activeCanvas.getContext("2d");

      if (!context) {
        return;
      }

      const bounds = activeContainer.getBoundingClientRect();
      const devicePixelRatio = window.devicePixelRatio || 1;

      // Render at half resolution for faster calculations.
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

      if (points.length === 0) {
        context.fillStyle = "#1b1e22";
        context.fillRect(0, 0, width, height);
        return;
      }

      const imageData = context.createImageData(width, height);
      const pixels = imageData.data;

      const colors = points.map((_, index) =>
        hexToRgb(getRegionColor(index)),
      );

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const normalizedX = (x + 0.5) / width;
          const normalizedY = (y + 0.5) / height;

          const ownerIndex = findNearestPointIndex(
            normalizedX,
            normalizedY,
            points,
            metric,
          );

          const [red, green, blue] = colors[ownerIndex];
          const pixelIndex = (y * width + x) * 4;

          pixels[pixelIndex] = red;
          pixels[pixelIndex + 1] = green;
          pixels[pixelIndex + 2] = blue;
          pixels[pixelIndex + 3] = 185;
        }
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
  }, [points, metric]);

  return (
    <div className="visualization">
      <canvas
        ref={canvasRef}
        className="visualization__canvas"
      />

      <svg
        className="visualization__overlay"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-label="Voronoi seed points"
      >
        {points.map((point) => (
          <g key={point.id}>
            <circle
              cx={point.x * 100}
              cy={point.y * 100}
              r="1.2"
              vectorEffect="non-scaling-stroke"
            />

            <text
              x={point.x * 100 + 2}
              y={point.y * 100 - 2}
              vectorEffect="non-scaling-stroke"
            >
              {point.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default VisualizationArea;