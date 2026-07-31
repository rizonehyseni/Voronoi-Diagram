import type { Point2D } from "../types/geometry";

interface VisualizationAreaProps {
  points: Point2D[];
}

function VisualizationArea({
  points,
}: VisualizationAreaProps) {
  return (
    <div className="visualization">
      <canvas className="visualization__canvas" />

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