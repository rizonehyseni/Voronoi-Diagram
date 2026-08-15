export interface Point2D {
  id: string;
  x: number;
  y: number;
}

export interface CellAssignment {
  ownerIndex: number;
  arrivalTime: number;
}

export type DistanceMetric =
  | "euclidean"
  | "manhattan"
  | "chebyshev";