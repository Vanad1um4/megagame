import { COLORS, COLORS_GRAYSCALE } from "./const";

export type HexColor = typeof COLORS[keyof typeof COLORS];

export type ScaleLimits = {
  MIN: number;
  MAX: number;
};

export type TerrainConfig = {
  color: COLORS | COLORS_GRAYSCALE;
};

export type TerrainTypes = {
  Mountain: TerrainConfig;
  Forest: TerrainConfig;
  Field: TerrainConfig;
  Sand: TerrainConfig;
  Water: TerrainConfig;
};

export type TerrainCell = {
  terrain: TerrainTypes[keyof TerrainTypes];
};
