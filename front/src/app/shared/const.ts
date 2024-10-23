import { TerrainTypes } from "./type";


export enum COLORS_GRAYSCALE {
  White = '#FFFFFF',
  Gray1 = '#E6E6E6',
  Gray2 = '#CCCCCC',
  Gray3 = '#B3B3B3',
  Gray4 = '#999999',
  Gray5 = '#808080',
  Gray6 = '#666666',
  Gray7 = '#4D4D4D',
  Gray8 = '#333333',
  Gray9 = '#1A1A1A',
  Black = '#000000',
}

export enum COLORS {
  DarkGoldenrod = '#B8860B',
  PastelPurple = '#B39EB5',
  PastelYellow = '#FDFD96',
  PastelGreen = '#77DD77',
  ForestGreen = '#228B22',
  DeepSkyBlue = '#00BFFF',
  PastelPink = '#FFD1DC',
  SandyBrown = '#F4A460',
  Chartreuse = '#7FFF00',
  AquaMarine = '#7FFFD4',
  PastelBlue = '#A7C7E7',
  OrangeRed = '#FF4500',
  DarkGreen = '#006400',
  Turquoise = '#40E0D0',
  RosyBrown = '#BC8F8F',
  Lavender = '#E6E6FA',
  SkyBlue = '#87CEEB',
  HotPink = '#FF69B4',
  Fuchsia = '#FF00FF',
  Magenta = '#FF00FF',
  Maroon = '#800000',
  Salmon = '#FA8072',
  Yellow = '#FFFF00',
  Indigo = '#4B0082',
  Purple = '#800080',
  Silver = '#C0C0C0',
  Beige = '#F5F5DC',
  Coral = '#FF7F50',
  Green = '#00FF00',
  Olive = '#808000',
  Khaki = '#C3B091',
  Cyan = '#00FFFF',
  Gold = '#FFD700',
  Lime = '#00FF00',
  Blue = '#0000FF',
  Navy = '#000080',
  Red = '#FF0000',
  Tan = '#D2B48C',
}

export const HEX_SIZE: number = 128;

export const BASE_SIZE_PX: number = 2;

type ScaleLimits = {
  MIN: number;
  MAX: number;
};

export const SCALE_LIMITS: ScaleLimits = {
  MIN: 4,
  MAX: 7,
};

export const FIELD_RADIUS: number = 3;

export const TERRAIN_TYPES: TerrainTypes = {
  Mountain: { color: COLORS_GRAYSCALE.Gray4 },
  Forest: { color: COLORS.ForestGreen },
  Field: { color: COLORS.Green },
  Sand: { color: COLORS.SandyBrown },
  Water: { color: COLORS.Blue },
};

type XCoordinate = number;
type YCoordinate = number;

type YMap<T> = Map<YCoordinate, T>;
type XYMap<T> = Map<XCoordinate, YMap<T>>;

type InitCell = {
  terrain: TerrainTypes[keyof TerrainTypes];
};

export const INIT_MAP: XYMap<InitCell> = new Map([
  [-1, new Map<YCoordinate, InitCell>([
    [0, { terrain: TERRAIN_TYPES.Field }],  // y: 0
    [1, { terrain: TERRAIN_TYPES.Field }],  // y: 1
  ])],  // x: -1
  [0, new Map<YCoordinate, InitCell>([
    [-1, { terrain: TERRAIN_TYPES.Field }], // y: -1
    [0, { terrain: TERRAIN_TYPES.Field }],  // y: 0
    [1, { terrain: TERRAIN_TYPES.Field }],  // y: 1
  ])],  // x: 0
  [1, new Map<YCoordinate, InitCell>([
    [-1, { terrain: TERRAIN_TYPES.Field }], // y: -1
    [0, { terrain: TERRAIN_TYPES.Field }],  // y: 0
  ])],  // x: 1
]);
