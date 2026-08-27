import { describe, expect, it } from "vitest";
import {
  findNearestPointAssignment,
  findNearestPointIndex,
} from "./tessellation";
import type { Point2D } from "../types/geometry";

const points: Point2D[] = [
  { id: "P1", x: 0, y: 0 },
  { id: "P2", x: 1, y: 1 },
];

describe("findNearestPointAssignment", () => {
  it("returns the nearest owner and arrival time", () => {
    const assignment = findNearestPointAssignment(
      0.1,
      0.1,
      points,
      "euclidean",
    );

    expect(assignment.ownerIndex).toBe(0);
    expect(assignment.arrivalTime).toBeCloseTo(
      Math.hypot(0.1, 0.1),
    );
  });

  it("selects the second point when it is nearer", () => {
    expect(
      findNearestPointIndex(
        0.9,
        0.9,
        points,
        "euclidean",
      ),
    ).toBe(1);
  });

  it("resolves exact ties in favor of the first point", () => {
    expect(
      findNearestPointIndex(
        0.5,
        0.5,
        points,
        "manhattan",
      ),
    ).toBe(0);
  });

  it("handles an empty point collection", () => {
    const assignment = findNearestPointAssignment(
      0.5,
      0.5,
      [],
      "chebyshev",
    );

    expect(assignment.ownerIndex).toBe(-1);
    expect(assignment.arrivalTime).toBe(
      Number.POSITIVE_INFINITY,
    );
  });
});
