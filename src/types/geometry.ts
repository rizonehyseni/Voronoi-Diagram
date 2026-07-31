export interface Point2D {
  id: string;
  x: number;
  y: number;
}

export type DistanceMetric =
  | "euclidean"
  | "manhattan"
  | "chebyshev";