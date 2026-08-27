import { describe, expect, it } from "vitest";
import { createTessellationGrid } from "./grid";
import type {
  DistanceMetric,
  Point2D,
} from "../types/geometry";

describe("createTessellationGrid", () => {
  const cornerPoints: Point2D[] = [
    { id: "P1", x: 0, y: 0 },
    { id: "P2", x: 1, y: 1 },
  ];

  it("creates owner and arrival-time arrays", () => {
    const grid = createTessellationGrid(
      2,
      2,
      cornerPoints,
      "euclidean",
    );

    expect(grid.width).toBe(2);
    expect(grid.height).toBe(2);
    expect(grid.owners).toBeInstanceOf(Int16Array);
    expect(grid.arrivalTimes).toBeInstanceOf(
      Float32Array,
    );
    expect(grid.owners).toHaveLength(4);
    expect(grid.arrivalTimes).toHaveLength(4);
    expect(Array.from(grid.owners)).toEqual([
      0,
      0,
      0,
      1,
    ]);
  });

  it("tracks the maximum arrival time", () => {
    const grid = createTessellationGrid(
      2,
      2,
      cornerPoints,
      "euclidean",
    );

    expect(grid.maximumArrivalTime).toBeCloseTo(
      Math.hypot(0.25, 0.75),
    );
  });

  it("returns unowned cells for an empty point collection", () => {
    const grid = createTessellationGrid(
      3,
      2,
      [],
      "euclidean",
    );

    expect(Array.from(grid.owners)).toEqual([
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
    ]);

    expect(
      Array.from(grid.arrivalTimes).every(
        (arrivalTime) =>
          arrivalTime === Number.POSITIVE_INFINITY,
      ),
    ).toBe(true);

    expect(grid.maximumArrivalTime).toBe(0);
  });

  it("normalizes invalid grid dimensions", () => {
    const grid = createTessellationGrid(
      0,
      -4,
      cornerPoints,
      "euclidean",
    );

    expect(grid.width).toBe(1);
    expect(grid.height).toBe(1);
    expect(grid.owners).toHaveLength(1);
  });

  it("uses the selected distance metric for arrival times", () => {
    const point: Point2D[] = [
      { id: "P1", x: 0, y: 0 },
    ];

    const expectedMaximums: Record<
      DistanceMetric,
      number
    > = {
      euclidean: Math.hypot(0.75, 0.75),
      manhattan: 1.5,
      chebyshev: 0.75,
    };

    for (const metric of Object.keys(
      expectedMaximums,
    ) as DistanceMetric[]) {
      const grid = createTessellationGrid(
        2,
        2,
        point,
        metric,
      );

      expect(grid.maximumArrivalTime).toBeCloseTo(
        expectedMaximums[metric],
      );
    }
  });
});
