import { Injectable } from '@angular/core';

import { COLORS } from '../shared/const';
import { HexColor } from '../shared/type';

@Injectable({
  providedIn: 'root',
})
export class StateService {

  public field: Map<[number, number], { color: HexColor; }> = new Map();

  public centerCoordinates: [number, number] = [0, 0];

  public scale: number = 6;

  private initCells = new Map<[number, number], { color: HexColor; }>([
    [[0, -1], { color: COLORS.Green }],
    [[1, -1], { color: COLORS.Green }],

    [[-1, 0], { color: COLORS.Red }],
    [[0, 0], { color: COLORS.Red }],
    [[1, 0], { color: COLORS.Red }],

    [[-1, 1], { color: COLORS.Blue }],
    [[0, 1], { color: COLORS.Blue }],
  ]);

  constructor() {
    this.initCells.forEach((value, key) => {
      this.field.set(key, value);
    });
  }

}
