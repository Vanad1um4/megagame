import { COLORS } from "./const";

export type HexColor = typeof COLORS[keyof typeof COLORS];

export interface ScaleLimits {
  MIN: number;
  MAX: number;
}
