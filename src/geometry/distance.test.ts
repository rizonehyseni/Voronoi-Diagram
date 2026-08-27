import { describe, expect, it } from "vitest";
import { calculateDistance } from "./distance";

describe("calculateDistance", () => {
  const pointA = { x: 1, y: 2 };
  const pointB = { x: 4, y: 6 };

  it("calculates Euclidean distance", () => {
    expect(
      calculateDistance(
        pointA.x,
        pointA.y,
        pointB.x,
        pointB.y,
        "euclidean",
      ),
    ).toBe(5);
  });

  it("calculates Manhattan distance", () => {
    expect(
      calculateDistance(
        pointA.x,
        pointA.y,
        pointB.x,
        pointB.y,
        "manhattan",
      ),
    ).toBe(7);
  });

  it("calculates Chebyshev distance", () => {
    expect(
      calculateDistance(
        pointA.x,
        pointA.y,
        pointB.x,
        pointB.y,
        "chebyshev",
      ),
    ).toBe(4);
  });

  it("is symmetric for every metric", () => {
    const metrics = [
      "euclidean",
      "manhattan",
      "chebyshev",
    ] as const;

    for (const metric of metrics) {
      const forward = calculateDistance(
        pointA.x,
        pointA.y,
        pointB.x,
        pointB.y,
        metric,
      );

      const backward = calculateDistance(
        pointB.x,
        pointB.y,
        pointA.x,
        pointA.y,
        metric,
      );

      expect(forward).toBe(backward);
    }
  });

  it("returns zero for identical points", () => {
    expect(
      calculateDistance(0.4, 0.7, 0.4, 0.7, "euclidean"),
    ).toBe(0);
  });
});
