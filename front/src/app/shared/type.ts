import { COLORS, COLORS_GRAYSCALE } from "./const";


type TerrainConfig = {
  color: COLORS | COLORS_GRAYSCALE;
};

export type TerrainTypes = {
  Mountain: TerrainConfig;
  Forest: TerrainConfig;
  Field: TerrainConfig;
  Sand: TerrainConfig;
  Water: TerrainConfig;
};

export type Coordinates = {
  x: number;
  y: number;
};

export type CellData = {
  coordinates: Coordinates;
  terrain: TerrainTypes[keyof TerrainTypes];
  // buildings?: Building[];
  // resources?: Resource[];
  // passability?: PassabilityInfo;
};
