import { findNearestPointAssignment } from "./tessellation";
import type {
  DistanceMetric,
  Point2D,
} from "../types/geometry";

export interface TessellationGrid {
  width: number;
  height: number;
  owners: Int16Array;
  arrivalTimes: Float32Array;
  maximumArrivalTime: number;
}

export function createTessellationGrid(
  width: number,
  height: number,
  points: Point2D[],
  metric: DistanceMetric,
): TessellationGrid {
  const gridWidth = Math.max(1, Math.floor(width));
  const gridHeight = Math.max(1, Math.floor(height));
  const cellCount = gridWidth * gridHeight;

  const owners = new Int16Array(cellCount);
  const arrivalTimes = new Float32Array(cellCount);

  owners.fill(-1);
  arrivalTimes.fill(Number.POSITIVE_INFINITY);

  let maximumArrivalTime = 0;

  if (points.length === 0) {
    return {
      width: gridWidth,
      height: gridHeight,
      owners,
      arrivalTimes,
      maximumArrivalTime,
    };
  }

  for (let y = 0; y < gridHeight; y += 1) {
    for (let x = 0; x < gridWidth; x += 1) {
      const normalizedX = (x + 0.5) / gridWidth;
      const normalizedY = (y + 0.5) / gridHeight;
      const cellIndex = y * gridWidth + x;

      const assignment = findNearestPointAssignment(
        normalizedX,
        normalizedY,
        points,
        metric,
      );

      owners[cellIndex] = assignment.ownerIndex;
      arrivalTimes[cellIndex] =
        assignment.arrivalTime;

      maximumArrivalTime = Math.max(
        maximumArrivalTime,
        assignment.arrivalTime,
      );
    }
  }

  return {
    width: gridWidth,
    height: gridHeight,
    owners,
    arrivalTimes,
    maximumArrivalTime,
  };
}