export type TrackPoint = { x: number; y: number };
export type Bounds = { minX: number; maxX: number; minY: number; maxY: number };

export type DriverFrame = {
    x: number;
    y: number;
    dist: number;
    lap: number;
    position: number;
};

export type Frame = {
    t: number;
    drivers: Record<string, DriverFrame>;
};

export interface Props {
    year: number,
    circuitName: string,
    session: string
}

export type ReplayParams = {
  API_BASE: string;
  year: number;
  circuitName: string;
  session: string;
};
