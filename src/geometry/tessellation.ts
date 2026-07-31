import { calculateDistance } from "./distance";
import type {
  DistanceMetric,
  Point2D,
} from "../types/geometry";

export function findNearestPointIndex(
  x: number,
  y: number,
  points: Point2D[],
  metric: DistanceMetric,
): number {
  if (points.length === 0) {
    return -1;
  }

  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];

    const distance = calculateDistance(
      x,
      y,
      point.x,
      point.y,
      metric,
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  }

  return nearestIndex;
}