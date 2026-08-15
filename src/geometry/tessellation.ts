import { calculateDistance } from "./distance";
import type {
  CellAssignment,
  DistanceMetric,
  Point2D,
} from "../types/geometry";

export function findNearestPointAssignment(
  x: number,
  y: number,
  points: Point2D[],
  metric: DistanceMetric,
): CellAssignment {
  if (points.length === 0) {
    return {
      ownerIndex: -1,
      arrivalTime: Number.POSITIVE_INFINITY,
    };
  }

  let ownerIndex = 0;
  let arrivalTime = Number.POSITIVE_INFINITY;


  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];

    const distance = calculateDistance(
      x,
      y,
      point.x,
      point.y,
      metric,
    );

    if (distance < arrivalTime) {
      arrivalTime = distance;
      ownerIndex = index;
    }
  }

  return {
    ownerIndex,
    arrivalTime,
  };
}

export function findNearestPointIndex(
  x: number,
  y: number,
  points: Point2D[],
  metric: DistanceMetric,
): number {
  return findNearestPointAssignment(
    x,
    y,
    points,
    metric,
  ).ownerIndex;
}