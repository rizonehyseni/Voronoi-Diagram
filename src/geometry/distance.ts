import type { DistanceMetric } from "../types/geometry";

export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  metric: DistanceMetric,
): number {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);

  switch (metric) {
    case "manhattan":
      return dx + dy;

    case "chebyshev":
      return Math.max(dx, dy);

    case "euclidean":
      return Math.hypot(dx, dy);
  }
}